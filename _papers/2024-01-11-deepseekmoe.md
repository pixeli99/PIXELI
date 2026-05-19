---
title: "DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models"
date: 2024-01-11
authors: DeepSeek-AI (Dai et al.)
venue: arXiv preprint / ACL 2024
link: https://arxiv.org/abs/2401.06066
tags: [MoE, DeepSeek, Routing, Sparse, Scaling]
math: true
---

## 一句话

把 MoE 的专家切得更细，再固定一小撮 shared expert 兜底，让每个 routed expert 真的学到不同的东西。

## 方法

两个动作叠在一起：

- **Fine-grained expert segmentation**：把每个 FFN expert 沿 hidden 维拆成 $m$ 份，专家总数 $N \to mN$，激活数 $K \to mK$，单专家的 FLOPs 不变，但 top-K 的组合数指数级变多——同样算力下专家可以更"窄"也更"专"。
- **Shared expert isolation**：把 $K_s$ 个专家固定不参与路由，每个 token 都过；剩下 $mN - K_s$ 个走 top-$(mK - K_s)$。共享专家吃掉公共知识，routed 那一摞就不用各自重学一遍 common pattern。

负载均衡用 expert-level + device-level 两层 auxiliary loss。

规模三档：2B（验证概念）、16B（对标 LLaMA2-7B，激活 2.8B）、145B（对标 DeepSeek 67B，激活 22.2B）。16B 版本在多数 benchmark 上和 LLaMA2-7B 持平甚至超过，计算量只用约 40%。Ablation 显示 shared expert 拆掉会掉 1～2 个点。

## 想法

细粒度切分这一步漂亮——它本质上是把 MoE 的 capacity 维度从"专家数"挪到"专家组合数"，相当于在固定 active params 的预算下偷偷塞了更多 routing 灵活度。Shared expert 的动机讲得也合理，但论文里 shared 数量的扫描其实做得不够细，$K_s=1$ 还是 2 看起来更多是经验。

后面 V2/V3 路线基本就是把这套放大，再换掉 aux loss（见 Loss-Free Balancing）。下一步该看：路由是否真的稳定到能上 RL，以及 expert specialization 怎么可视化才算可信——论文里那个 routing similarity 矩阵其实信息量不大。

## 引用

```bibtex
@article{dai2024deepseekmoe,
  title   = {DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models},
  author  = {Dai, Damai and Deng, Chengqi and Zhao, Chenggang and Xu, R.X. and others},
  journal = {arXiv preprint arXiv:2401.06066},
  year    = {2024}
}
```
