---
title: DeepSeek MoE 脉络
date: 2026-05-20
tags: [MoE, DeepSeek, 综述]
math: true
excerpt: 从 DeepSeekMoE（2024.01）到 V4 Preview（2026.04）这条线的整理：细粒度专家、共享专家隔离、无辅助 loss 负载均衡、FP8、DSA、MLA → CSA/HCA 的演化。
---

## 一句话总结

DeepSeek 从 2024 年初的 DeepSeekMoE 提出"细粒度专家 + 共享专家隔离"开始，把 MoE 从 GShard/Mixtral 那种"少数大专家、top-2"的粗粒度路由，逐步推到 V3 的"256 个细粒度专家 + 1 个共享专家 + top-8 + 无辅助 loss 的 bias 调整 + FP8/DualPipe"这一套量产级配方；后续 V3.1/V3.2 的工作重点已经不在 MoE 本体，而在和 attention（MLA → DSA）以及推理 infra（大规模 EP、PD 分离）的协同上。

## 时间轴

| 时间 | 工作 | arXiv / 链接 | 核心改动 |
|---|---|---|---|
| 2024.01 | DeepSeekMoE | [2401.06066](https://arxiv.org/abs/2401.06066) | 细粒度专家切分 + 共享专家隔离；2B/16B/145B |
| 2024.05 | DeepSeek-V2 | [2405.04434](https://arxiv.org/abs/2405.04434) | MLA + DeepSeekMoE；236B/21B；160 routed + 2 shared，top-6，group-limited routing |
| 2024.07 | ESFT | [2407.01906](https://arxiv.org/abs/2407.01906) | 利用细粒度专家做 expert-specialized fine-tuning |
| 2024.08 | Loss-Free Balancing | [2408.15664](https://arxiv.org/abs/2408.15664) | 提出无辅助 loss 的 bias 调整路由，V3 路由策略的预研 |
| 2024.12 | DeepSeek-V3 | [2412.19437](https://arxiv.org/abs/2412.19437) | 671B/37B；256 routed + 1 shared，top-8；auxiliary-loss-free；MTP；FP8；DualPipe |
| 2025.01 | DeepSeek-R1 | [2501.12948](https://arxiv.org/abs/2501.12948) | 架构沿用 V3，RL 推理训练，不动 MoE |
| 2025.02 | NSA (Native Sparse Attention) | [2502.11089](https://arxiv.org/abs/2502.11089) | 分支型可训练稀疏注意力，长上下文方向的另一条腿 |
| 2025.05 | Hardware Insights | [2505.09343](https://arxiv.org/abs/2505.09343) | V3 训练 infra 的复盘 paper（ISCA'25），FP8/网络拓扑 |
| 2025.08 | DeepSeek-V3.1 | HF: deepseek-ai/DeepSeek-V3.1 | 混合 think/non-think 模式；UE8M0 FP8 |
| 2025.09 | DeepSeek-V3.2-Exp | [api-docs 250929](https://api-docs.deepseek.com/news/news250929) | 引入 DSA（lightning indexer + top-k=2048 token selection），MoE 不动 |
| 2025.12 | DeepSeek-V3.2 paper | [2512.02556](https://arxiv.org/abs/2512.02556) | DSA 完整技术报告，长上下文 $O(kL)$ |
| 2026.04 | DeepSeek-V4 Preview | [api-docs 260424](https://api-docs.deepseek.com/news/news260424) | V4-Pro 1.6T/49B、V4-Flash 284B/13B；CSA + HCA 混合注意力；mHC；Muon 优化器；1M 上下文 |

## 脉络

### 1. 起点：DeepSeekMoE（2024.01）

要解决的是 GShard/Switch/Mixtral 一脉的两个老问题：**知识混合**（每个专家承担太多种类的知识，难以专精）和**知识冗余**（不同专家学到几乎一样的通用知识）。Mixtral 8x7B 的做法是 8 个标准 FFN、top-2 路由、没有 shared expert（[2401.04088](https://arxiv.org/abs/2401.04088)），路由非常粗。

DeepSeekMoE 的两步走（[2401.06066](https://arxiv.org/abs/2401.06066)）：

1. **Fine-grained expert segmentation**：把每个 expert 的中间维度切到 $1/m$，专家数变成 $mN$，激活数变成 $mK$。FLOPs 和参数预算不变，但 top-K 组合的可能性指数级变多。16B 配置：$m=4$，64 个 routed expert（每个是标准 FFN 的 0.25 倍）+ 2 个 shared expert，top-6。
2. **Shared expert isolation**：把通用知识压到 $K_s$ 个 shared expert（始终激活），让其他 routed expert 不再被迫学共性。

这两步合起来导致一个判断：DeepSeek 从一开始就押注"**稀疏度高、单个专家小、共享专家兜底**"，而不是 Mixtral 那种"少而大、纯路由"的路线。后面所有版本都是这条假设的延伸。

### 2. 与 attention 协同：DeepSeek-V2（2024.05）

V2 把 DeepSeekMoE 拼上 **MLA**（Multi-head Latent Attention，[2405.04434](https://arxiv.org/abs/2405.04434)）。动机不是"想要更好 attention"，而是 **MoE 在推理时的瓶颈已经从 FLOPs 转到带宽** —— 稀疏激活让计算变便宜，KV cache 反而成了显存大头。MLA 把 K/V 压到一个低秩 latent（kv_lora_rank=512），推理时再投出来，相比 DeepSeek 67B 砍掉 93.3% 的 KV cache，吞吐提到 5.76×。

V2 的 MoE 配置：236B 总参 / 21B 激活，160 routed + 2 shared，top-6，moe_intermediate_size=1536。注意一个工程妥协 ——`topk_method = "group_limited_greedy"`、`n_group=8`、`topk_group=3`：把 160 个专家分 8 组，先选 3 组再在组里 top-K，这是为了**约束跨节点通信** —— 纯 top-K 在 160 选 6 时会引发任意 GPU 到任意 GPU 的 all-to-all，分组限制能压住通信扇出。这一条到 V3 进一步演化。同时 V2 还在用传统的 aux_loss（alpha=0.001）。

### 3. 工业化：DeepSeek-V3（2024.12）

V3（[2412.19437](https://arxiv.org/abs/2412.19437)）把 V2 的方向推到极致，是这条脉络上**信息密度最高的一篇**：

- **专家粒度再往细推**：256 routed + **1 shared**，top-8，moe_intermediate_size=2048。shared expert 从 V2 的 2 减到 1，routed 从 160 涨到 256 —— 直觉上 shared 不需要多，1 个就能兜底通用语料；而把预算尽量给 routed，让稀疏度更高。671B 总参 / 37B 激活，稀疏比从 V2 的 ~9% 降到 ~5.5%。
- **Auxiliary-loss-free load balancing**：V3 把 [2408.15664](https://arxiv.org/abs/2408.15664) 这篇预研落地 —— 给每个 expert 一个 bias，在 top-K 之前加上去；如果某个 expert 最近被路由太多，就降它的 bias，反之升。**没有反传 gradient**，纯统计调度。这是因为 aux_loss 会跟主任务 loss 抢梯度，让模型为了均衡牺牲质量。V3 还是保留了一个"sequence-wise auxiliary loss"做兜底，但权重极小。
- **MTP（Multi-Token Prediction）**：每个 token 多预测 1 个未来 token（$D=1$）。训练时是辅助目标，推理时这个头可以当 speculative decoding 的 draft 用。这是把训练目标和推理优化打通的一次设计。
- **FP8 训练**：activation 用 1×128 per-token tile，weight 用 128×128 per-block tile 做 FP8，CUDA core 高精度累加。这是第一个公开的大规模 FP8 预训练。意义是双重的 —— 既是省 HBM 带宽（all-to-all 通信量直接减半），也是省存储。
- **DualPipe**：流水线把每个 chunk 切成 attention / all-to-all dispatch / MLP / all-to-all combine 四段，前向反向的通信和计算交错，让 all-to-all 几乎完全被算掩盖。这一项是工程上的硬功夫，跟 EP 配合才有意义。

这一代基本定了 DeepSeek MoE 现在的形状。R1（[2501.12948](https://arxiv.org/abs/2501.12948)）只在这之上做 RL，**架构一字不改** —— 这是个判断信号：他们认为 V3 这套 MoE 在当前算力下已经够用，瓶颈不在 MoE 本体了。

### 4. 持续迭代：V3.1 / V3.2 / V4

**V3.1（2025.08）**：参数规模没变（685B/37B），主要做两件事 —— 一个模型同时支持 think/non-think 两种模式（不是两个模型 router）；以及训练时用 **UE8M0 FP8 scale 格式**，明显是为了 microscaling、特别是国产芯片（Ascend、寒武纪等）兼容性。**MoE 本体不动**。

**V3.2-Exp（2025.09）/ V3.2（2025.12）**：核心是 **DSA（DeepSeek Sparse Attention）**。从 V3.1-Terminus checkpoint 继续训。机制是：

- **Lightning indexer**：一个轻量打分器，对每个 query 给历史 token 算相关性分。
- **Fine-grained token selection**：每个 query 选 top-$k=2048$ 个 KV token 进真正的 attention，其余直接跳过。
- 训练上是先冻主模型、让 indexer 学着对齐 full attention 的输出（用了 $7.3\times10^{-6}$ 的 lr、$480\times128K$ seq × 15000 步 $\approx$ 943.7B token），再放开主模型继续训。
- 复杂度从 $O(L^2)$ 降到近似 $O(kL)$，长上下文推理成本相对 V3.1 砍 6-7 倍，API 降价 50%+。
- **MoE 完全没动** —— V3.2 的 HF README 明确说 "deliberately aligned the training configurations with V3.1-Terminus"。这条印证：DeepSeek 把效率红利从 MoE 一侧转到了 attention 一侧。

DSA 不是凭空冒出来的，是 [NSA（2502.11089）](https://arxiv.org/abs/2502.11089) 的工程化。NSA 是 2025.02 那篇 "Native Sparse Attention"，提出三分支（compression / selection / sliding window）的硬件友好稀疏 attention，可端到端训。DSA 在 NSA 基础上简化成"indexer + selector"两件套，更工程。

**V4（2026.04 Preview）**：V4-Pro 1.6T/49B、V4-Flash 284B/13B（[api-docs](https://api-docs.deepseek.com/news/news260424)）。注意三个变化：

- 注意力换成 **CSA（Compressed Sparse Attention）+ HCA（Heavily Compressed Attention）** 的混合架构，进一步压 KV cache（声称对比 V3.2 再减 90% cache 足迹、27% FLOPs）。
- 优化器换成 **Muon**（不再是 AdamW），这是和外部社区（Keller Jordan 那条线）的趋同。
- **mHC（Manifold-Constrained Hyper-Connections）**：层间连接做了改造。

V4 的 MoE 具体专家数官方报告未完全披露细节，但 1.6T/49B 的稀疏度（~3%）比 V3 的 5.5% 进一步压低，方向延续"更细更稀"。

## 几条隐线

### 专家粒度

| 版本 | routed | shared | top-K | 总/激活 | 稀疏度 |
|---|---|---|---|---|---|
| DeepSeekMoE 16B | 64 | 2 | 6 | 16B/2.8B | ~17% |
| V2 | 160 | 2 | 6 | 236B/21B | ~9% |
| V3 | 256 | 1 | 8 | 671B/37B | ~5.5% |
| V4-Pro | 未细公开 | — | — | 1.6T/49B | ~3% |

方向非常一致：**routed 越拆越多、shared 越来越少、激活比例越来越稀疏**。这是个赌注 —— 他们相信继续提高稀疏度还有 scaling 红利。注意 shared expert 从 2 减到 1 是个很微妙的决定，意味着"通用知识"那块的体量在 V3 体系里没那么重要，更多让 routed expert 自己组合出通用能力。

### 负载均衡

aux_loss（V1/V2）→ loss-free bias 调整（[2408.15664](https://arxiv.org/abs/2408.15664) → V3）→ 推理侧用 **EPLB（Expert Parallel Load Balancer）** 做 GPU 层面的专家放置和复制。V3 之后没再大改路由，但路由策略仍然保留了 group-limited 这一类硬约束来压通信扇出。

### 训练 infra

V3 那份 [2412.19437](https://arxiv.org/abs/2412.19437) 已经把 FP8、DualPipe、跨节点 all-to-all 优化写齐了，但他们 2025.05 又单独出了一篇 [2505.09343](https://arxiv.org/abs/2505.09343)（ISCA'25 Industry Track），更聚焦硬件协同设计、多平面网络拓扑、对未来加速器的反思。可以理解为 V3 的 infra 复盘。V3.1 的 UE8M0 FP8 格式则是面向国产硬件的进一步特化。

### 推理优化

MLA（V2）→ EP + PD 分离（开源生态在 V3 之后追上）→ DSA（V3.2）。LMSYS 在 2025.05 用 96×H800 跑 V3，配 PD disaggregation + 大规模 EP，单节点 prefill 73.7k tok/s、decode 14.8k tok/s（[LMSYS blog](https://www.lmsys.org/blog/2025-05-05-large-scale-ep/)）。DeepSeek 自家也开源了 [DeepEP](https://github.com/deepseek-ai/DeepEP)、[FlashMLA](https://github.com/deepseek-ai/FlashMLA) 等 kernel。DSA 的引入解决了 long context 下 attention 占比反弹的问题 —— MoE 让 FLOPs 稀疏了，但当上下文拉到 128K，attention 又重新占主导，所以 V3.2 必须从 attention 下刀。

## 与同时代 MoE 的差异

放在 2025 年下半年的横切面看：

- **Mixtral（[2401.04088](https://arxiv.org/abs/2401.04088)）**：8 expert / top-2 / 无 shared，专家是标准 FFN。粗粒度路线，跟 DeepSeek 思路相反。
- **Qwen3 MoE**：路线和 DeepSeek 接近（细粒度 + 共享），但激活参数更多（35B 级别）、稀疏度低于 DeepSeek。
- **Kimi K2**：384 expert / top-8 / 1T 总参 32B 激活 —— 稀疏度比 V3 还激进，路线明显是从 DeepSeek 这套抄过去再加码。
- **GLM-4.5**：MoE + 强化 agentic 训练，激活规模 32B 量级，架构层面相对保守。

DeepSeek 的差异化在于：(1) **细粒度专家**是这条线的开山者，(2) **shared expert 隔离**这一招其他厂跟得不彻底，(3) **loss-free balancing** 是他们独家，多数厂还在改 aux_loss 系数，(4) FP8 训练量产是他们先做的，(5) MoE 不是孤立设计，永远跟 MLA / DualPipe / EPLB 这套 infra 一起出现 —— 这是别家拿不走的部分。

## 还未解决 / 值得追的方向

- **shared expert 还会不会进一步减少甚至消失？** V3 已经只有 1 个，V4 还没看到明确披露。如果消失了说明 routed expert 数量到 256+ 时已经能自己学出通用能力。
- **专家粒度的 scaling law**：DeepSeek 没公开发文章直接讨论"专家数 vs 性能"的 scaling 曲线，但他们的版本走向暗示了一个经验拟合，外部还没人复现到 256+ routed 的 ablation。
- **DSA + MLA 的耦合**：V3.2 把 DSA 缝在 MLA 上面，长期看是不是要再统一一次？V4 的 CSA/HCA 看起来就是回答这个。
- **国产芯片路径**：UE8M0 FP8 是个明显的信号，V4 这一代如果真要量产，可能会出现 MoE 设计为了适配国产 NPU 通信拓扑而做的调整。
- **R2 缺位**：到 2026.05 还没看到正式的 R2 发布，可能 V4-Pro 的 think 模式已经覆盖了 R 线的需求。值得继续追。

## 调研覆盖的源

1. DeepSeekMoE 论文：[arXiv:2401.06066](https://arxiv.org/abs/2401.06066)
2. DeepSeek-V2 论文：[arXiv:2405.04434](https://arxiv.org/abs/2405.04434)
3. DeepSeek-V2 HF config：[huggingface.co/deepseek-ai/DeepSeek-V2](https://huggingface.co/deepseek-ai/DeepSeek-V2)
4. ESFT 论文：[arXiv:2407.01906](https://arxiv.org/abs/2407.01906)
5. Loss-Free Balancing：[arXiv:2408.15664](https://arxiv.org/abs/2408.15664)
6. DeepSeek-V3 技术报告：[arXiv:2412.19437](https://arxiv.org/abs/2412.19437)
7. DeepSeek-R1 论文：[arXiv:2501.12948](https://arxiv.org/abs/2501.12948)
8. Native Sparse Attention：[arXiv:2502.11089](https://arxiv.org/abs/2502.11089)
9. Hardware Insights for V3（ISCA'25）：[arXiv:2505.09343](https://arxiv.org/abs/2505.09343)
10. DeepSeek-V3.2-Exp 官方公告：[api-docs.deepseek.com/news/news250929](https://api-docs.deepseek.com/news/news250929)
11. DeepSeek-V3.2 完整论文：[arXiv:2512.02556](https://arxiv.org/abs/2512.02556)
12. vLLM 关于 DSA 的实现博客：[blog.vllm.ai/2025/09/29/deepseek-v3-2.html](https://blog.vllm.ai/2025/09/29/deepseek-v3-2.html)
13. LMSYS Large-Scale EP 部署：[lmsys.org/blog/2025-05-05-large-scale-ep](https://www.lmsys.org/blog/2025-05-05-large-scale-ep/)
14. Mixtral 对照：[arXiv:2401.04088](https://arxiv.org/abs/2401.04088)
15. DeepSeek-V4 Preview 官方页：[api-docs.deepseek.com/news/news260424](https://api-docs.deepseek.com/news/news260424)
