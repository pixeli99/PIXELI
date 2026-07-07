---
title: World Arena 与 World Model 脉络
date: 2026-05-20
tags: [World Model, 评测, 综述]
excerpt: 先把"World Arena"这个名字搞清楚（清华 WorldArena vs. WorldMark），再串起从 Ha & Schmidhuber 2018 到 Genie 3 / Cosmos / Marble 这条线，重点是几条隐线：定义之争、可控性、评测、数据。
---

> 看交互式全景图：[/world-models/](/PIXELI/world-models/)

## 关于"World Arena"

先把名字这件事讲清楚：搜下来，**最贴合"World Arena 榜单"这个说法的，是清华 FIB Lab 牵头、于 2026 年 2 月放出的 WorldArena**（[arXiv:2602.08971](https://arxiv.org/abs/2602.08971)，v1 提交于 2026-02-09，仓库 [github.com/tsinghua-fib-lab/WorldArena](https://github.com/tsinghua-fib-lab/WorldArena)，门户 [world-arena.ai](https://world-arena.ai/)）。它定位为"统一评测 embodied world model 的基准" —— 既测 video perception（16 个指标 / 6 个子维度），也测 functional utility（让 world model 充当 synthetic data engine、policy evaluator、action planner 三种角色），最终汇总成一个叫 **EWMScore** 的指数。这个项目还挂了一个 CVPR 2026 Challenge，submission 从 2026-03-06 开放、challenge 2026-03-26 启动，所以它现在确实是社区里被引用的"那个 Arena"。

**重要的一点是它真有"battle"机制**：world-arena.ai 上有 Arena online battle，用户可以上传自己的视频，和 leaderboard 上最优视频做实时比较 —— 这就是"像 LMSYS Chatbot Arena 那样做人类偏好对比"的具体落地。

但也要诚实地说一句：**"World Arena"作为名字并不唯一**。同一时间段还有另一个项目叫 **WorldMark / World Model Arena**（[arXiv:2604.21686](https://arxiv.org/abs/2604.21686)，2026-04-23），由 Xiaojie Xu 等人提出，**专门针对 interactive video world model**（Genie、YUME、HY-World、Matrix-Game 这一类），统一了 WASD 动作映射、500 个分层评测样例，并预告了一个叫 "World Model Arena" 的在线对战平台。如果问的是"可玩 world model 的 Arena"，那其实是 WorldMark；如果问的是"广义 embodied world model 的统一榜单"，那就是清华 WorldArena。

下文以**清华 WorldArena 为主锚点**，辅以 WorldMark 作为补充。

## 一句话总结

WorldArena 的存在，本身就标志着 world model 这条路线从"单点 demo 卖情怀"进入了"必须横向比对、必须证明能干活"的阶段 —— 而它榜单上的代表性工作正好串起一条清晰的脉络：**从 Ha & Schmidhuber 的 RL world model（2018）→ Sora 这种规模化视频生成"世界模拟器"（2024）→ Genie 这种可玩世界（2024–2025）→ Cosmos、GAIA-3、1X World Model 这种为机器人和驾驶服务的物理仿真级 world model（2025–2026）**，而 LeCun 的 V-JEPA 2 是这条主线之外、坚持"不要预测像素"的另一种哲学。

## 时间轴

| 时间 | 工作 | 链接 | 一句话定位 |
| --- | --- | --- | --- |
| 2018-03 | Ha & Schmidhuber, World Models | [1803.10122](https://arxiv.org/abs/1803.10122) | 用 VAE+RNN 在 latent 空间做 dream，奠定 world model 范式 |
| 2023-01 | DreamerV3 (Hafner et al.) | [2301.04104](https://arxiv.org/abs/2301.04104) | 单套超参横扫 150+ 任务，第一个在 Minecraft 从零挖到钻石 |
| 2023-06 | I-JEPA | [ai.meta.com blog](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/) | LeCun 路线的第一步：预测表示而非像素 |
| 2023-09 | Wayve GAIA-1 | [wayve.ai/science/gaia](https://wayve.ai/science/gaia/) | 第一个面向自动驾驶的生成式 world model |
| 2024-02 | OpenAI Sora | [openai.com 报告](https://openai.com/index/video-generation-models-as-world-simulators/) | 把"视频生成 = 世界模拟器"砸进主流叙事 |
| 2024-02 | DeepMind Genie | [2402.15391](https://arxiv.org/abs/2402.15391) | 11B 参数，无标注视频学 latent action，可玩 2D 世界 |
| 2024-10 | Decart / Etched Oasis | [oasis-model.github.io](https://oasis-model.github.io/) | 实时生成的 Minecraft 克隆，20 FPS |
| 2024-12 | DeepMind Genie 2 | [deepmind 博客](https://deepmind.google/blog/genie-2-a-large-scale-foundation-world-model/) | 一张图 → 可玩 3D 世界，"foundation world model"标签出现 |
| 2025-01 | NVIDIA Cosmos (CES) | [nvidia.com/ai/cosmos](https://www.nvidia.com/en-us/ai/cosmos/) | Physical AI 的 world foundation model 平台 |
| 2025-02 | Microsoft Muse / WHAM | [research.microsoft 博客](https://www.microsoft.com/en-us/research/blog/introducing-muse-our-first-generative-ai-model-designed-for-gameplay-ideation/) | Bleeding Edge / Quake II 游戏 world model |
| 2025-03 | Wayve GAIA-2 | [wayve.ai/press](https://wayve.ai/press/wayve-unveils-gaia2/) | 多视角、可控的驾驶 world model |
| 2025-06 | Meta V-JEPA 2 | [2506.09985](https://arxiv.org/abs/2506.09985) | 1.2B 自监督视频世界模型，主打 zero-shot 机器人规划 |
| 2025-08 | DeepMind Genie 3 | [deepmind 博客](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/) | 第一个实时通用 interactive world model，720p/24fps |
| 2025-09 | OpenAI Sora 2 | [openai.com/sora-2](https://openai.com/index/sora-2/) | 强调物理一致性、同步音频 |
| 2025-11 | World Labs Marble | [worldlabs.ai](https://worldlabs.ai) | Fei-Fei Li，文本/图像/视频 → 可导出 3D 场景 |
| 2025-12 | Wayve GAIA-3 | [wayve.ai/thinking](https://wayve.ai/thinking/gaia-3/) | 15B 参数，从 simulation 走向 evaluation |
| 2026-01 | 1X World Model | [1x.tech](https://www.1x.tech/discover/1x-world-model) | NEO 人形机器人的认知核心 |
| 2026-02 | Tsinghua WorldArena | [2602.08971](https://arxiv.org/abs/2602.08971) | 14 个模型的统一评测，EWMScore；CVPR 2026 Challenge |
| 2026-04 | WorldMark / World Model Arena | [2604.21686](https://arxiv.org/abs/2604.21686) | 专门面向 interactive video world model 的统一战场 |

## 脉络

### 1. 起源：从 RL world model 到生成式 world model

最初的 world model 是 **Ha & Schmidhuber 2018** 那篇 —— 动机非常 RL：让 agent 在 latent 空间"做梦"，省下真实环境的交互开销。架构是 V(VAE) + M(MDN-RNN) + C(controller)，CarRacing 和 VizDoom 是它的试金石。这条线后来由 Hafner 接住，从 PlaNet → DreamerV1 → V2 → **DreamerV3**长成主干：第一次在 Minecraft 从零挖钻石、第一次有"单套超参数跨 150+ 任务"的 world model 算法。IRIS、TWM 这一支则把 transformer 引入，把 world modeling 重述为 image-token 上的语言建模。

判断：这一阶段的 world model 是**为 policy 服务的**，并不关心生成的视频好不好看。评估靠 task reward、不靠 video metric。WorldArena 的"perception–functionality gap"批评，针对的就是后面的视频派 —— RL 派从一开始就只在乎 functionality。

### 2. 视频生成派的崛起

2024 年初 **Sora 的技术报告**把 "video generation model = world simulator" 这个口号正式立了起来：DiT 在 spacetime patch 上工作，scaling 似乎自然涌现物理（一笔涂过画布会留下痕迹、人咬一口汉堡会留下咬痕）。然后是 Google 这边的 VideoPoet、Lumiere → **Veo 2 → Veo 3（2025）**，Veo 3 主打物理一致性 + 原生音频。**Sora 2（2025-09-30）**进一步强调物理（投篮不进会真的反弹），还把"把现实里的人/物注入视频"做成产品功能。开源/半开源这条线则是 CogVideoX、Wan 2.2 / Wan 2.6、Kling、Hailuo 等 —— 值得注意的是 WorldArena 评测里 **Wan 2.6 在视觉维度上其实把 Veo 3.1 顶到并列第一**。

判断：视频生成派给 world model 这个词带来了两样新东西 —— **规模**和**多模态条件**，但也带来了哲学上的混乱（下文"定义之争"）。这一派的代表作很少自称是 RL 意义上的 world model，但市场和媒体把它们包了进来。

### 3. 可交互派的爆发（2024–2025 最热的一支）

如果说 Sora 让视频派变成"世界模拟器"，**Genie 系列**则定义了"可玩"这个维度。

- **Genie 1**（[2402.15391](https://arxiv.org/abs/2402.15391), 2024-02）：11B，从无标注视频里**学出 latent action**，给玩家一帧一帧的 keyboard 控制。
- **Genie 2**（2024-12）：直接出 3D 世界，从一张图开始。
- **Genie 3**（2025-08）：DeepMind 说是"第一个 real-time interactive general-purpose world model"，720p/24fps，分钟级一致性，靠的是模型保留过往输出的记忆。2026-01-29 以 "Project Genie" 形式向 AI Ultra ($250/月) 用户开放。

并行的几条：

- **Decart Oasis**（2024-10）：实时生成 Minecraft 克隆，20 FPS，autoregressive DiT + 自研推理栈，证明"实时"在消费级延迟下可达。
- **Microsoft Muse / WHAM**（2025-02，Nature 发表）：跟 Ninja Theory 合作，从 Bleeding Edge 学起；**WHAMM**（MaskGIT 版）把 Quake II 做到实时可玩。
- **MineWorld**、**Matrix-Game**、**HY-World**、**YUME** 等：开源/学术阵营追赶，这正好就是 WorldMark 想统一评测的那批模型。

判断：可玩 world model 现在卡在三件事上 —— **长时一致性**（Genie 3 的"分钟级"已经是当下最强）、**动作空间的开放性**（WASD 之外怎么扩展）、**和真正游戏引擎的差距**（probabilistic 而非 deterministic，玩家无法依靠规则）。

### 4. 行业派：驾驶、机器人、空间计算

这一派直接对接业务，不再装作要造"通用模拟器"。

- **驾驶**：Wayve GAIA-1（2023-09）→ **GAIA-2**（2025-03，多视角、controllable）→ **GAIA-3**（2025-12，15B 参数、10× 数据，主打"从 simulation 走向 evaluation" —— 把 world model 用作 AV 的安全评估器，宣称把合成测试拒收率降了 5 倍）。
- **机器人 / Physical AI**：**NVIDIA Cosmos**（CES 2025 首发，2025-03 GTC 大版本，2025-09 Cosmos Predict 2.5 / Transfer 2.5），整套含 Cosmos Predict（视频预测）、Cosmos Transfer（domain transfer / synthetic data）、Cosmos Reason（带 CoT 的时空推理），客户名单是 1X、Agility、Figure、Skild、Uber、Foretellix。**1X World Model**（2026-01 发布）则是把它收编为 NEO 人形机器人的"认知核心"。
- **空间 / 3D**：**World Labs Marble**（2025-11，Fei-Fei Li）跟前面几派最不一样 —— 它不输出视频帧，而是输出**可导出的 3D 资产**（gaussian splat / mesh / video），强调"spatial intelligence"。它把 world model 这个词从"序列预测"拽回了"3D 场景理解"。

判断：行业派最务实，也最早把"评估"做成产品（GAIA-3 直接打"evaluation"标签）。这一派对 WorldArena 的 functional utility 维度天然支持 —— Cosmos Predict 2.5 在 WorldArena 的 text-conditioned embodied 类里排第三，这不是偶然。

## 几条隐线

### 定义之争

业内对"world model"的定义**远未统一**。三种流派现在公开对线：

- **生成派**（Sora、Veo、Cosmos、GAIA）：能生成未来视频帧就算 world model，scaling 会涌现物理。
- **JEPA 派**（LeCun）：预测像素是徒劳的，因为视频里大部分内容内在不可预测；应该在抽象 latent 空间预测语义。V-JEPA 2 是这条线 2025 年最强的代表（1.2B、100 万小时视频自监督）。
- **可交互派**（Genie、Oasis、WHAM）：必须能接受动作输入并保持一致性，否则只是 video generator。

2026 年 3 月 Spring School AI For Impact 上 LeCun 和 Eric Xing 直接对线（"abstract latent prediction without a generative validator is meditation in a closed room"），但有评论指出这场争论的架构差异可能被高估 —— **生成模型加足够弱的重建损失 ≈ JEPA，JEPA 加足够强的信息正则 ≈ 生成模型**。WorldArena 的存在某种程度上回避了这场争论：你不用先承认自己是哪一派，跑分就完事。

### 可控性的演化

按代际看这条线非常清晰：

1. **纯 prompt**（Sora 1, VideoPoet, Lumiere）：文本进、视频出，控制粒度=整段。
2. **动作可控**（Genie 1, Oasis, WHAM）：每帧动作输入，但动作空间小（WASD/键鼠）。
3. **长时一致性**（Genie 3）：分钟级保持物体、场景记忆。
4. **物理一致性**（Sora 2, Veo 3, Cosmos）：守恒律、碰撞、object permanence 不再靠"传送"作弊。
5. **结构化条件**（GAIA-2/3）：ego dynamics、其他 agent 配置、道路语义、相机内外参 —— 已经像一个 driving sim 的 API。

### 评测的进化

为什么需要 WorldArena？因为 **FVD（Fréchet Video Distance）几乎是 world model 时代不可用的指标**。[ICLR 2025 "Beyond FVD"](https://arxiv.org/abs/2410.05203) 列出三条致命问题：I3D 特征非高斯、对时间扰动不敏感、需要不切实际的样本量。更要命的是 FVD 是 set-level 指标，**无法评价单条视频的内部一致性** —— 一个会生成统计上合理但逻辑荒谬的视频的模型可能跑得很好。

VBench-2.0 提出 "intrinsic faithfulness"（物理、常识、合成性、人体解剖），WorldArena 进一步把 functional utility（**当 policy evaluator、当 data engine、当 action planner**）拉进评测，这就是它跟 VBench 的核心差异：WorldArena 不允许你光好看，必须证明能让一个真机器人学到东西。

### 数据

被遮蔽但很重要的一条线：每一代 world model 的跃迁都伴随数据集放大。Sora 用 internet-scale 视频，V-JEPA 2 用 100 万小时视频，GAIA-3 比 GAIA-2 用了 10× 数据，1X World Model 用自家 NEO 在真实家庭里采的视频。**谁拿到机器人/驾驶的第一视角视频，谁就赢下了 embodied world model** —— 这一点 LeCun 在 V-JEPA 2 的发布里说得最直白。

## WorldArena 当前榜单分析

清华 WorldArena v2 评了 14 个模型（基于 RoboTwin 2.0 Clean-50，40 训练 / 10 测试集 / 双臂操作 50 任务）：

| 类别 | 模型 |
| --- | --- |
| 通用视频 | CogVideoX、Wan 2.2、**Wan 2.6**、**Veo 3.1**（仅这一个闭源） |
| 文本条件 embodied | Genie Envisioner、GigaWorld、TesserAct、Cosmos-Predict 2.5 (text)、WOW、RoboMaster、Cosmos-Predict 2.5 (action)、Vidar |
| 动作条件 embodied | IRASim、CtrlWorld |

按 paper 的 Figure 1 描述：**Wan 2.6 和 Veo 3.1 在感知层面并列最强**，Cosmos-Predict 2.5 (text) 紧随其后；**Genie Envisioner 在所有维度都垫底**。

回到脉络：

- 榜首 Wan 2.6 / Veo 3.1 = **视频生成派**的两个顶点（一开源一闭源）；
- 第二梯队 Cosmos-Predict 2.5 = **行业派 / Physical AI**；
- 垫底的 Genie Envisioner = embodied 派 —— 这就坐实了 paper 的核心结论 **perception–functionality gap**：视频好看的模型不一定能干活，干活的模型不一定好看。

**闭源 vs 开源**：14 个里只有 Veo 3.1 一个是闭源，其余全开。这跟 LLM Arena 形成强烈反差 —— LLM 榜单顶端基本都是闭源，而 world model 的开源率高得多。可能的原因：Sora 2、Genie 3、Marble 这些真正强的闭源 world model 都没把 API 开放到能跑统一评测的程度，所以暂时上不了榜。这本身就是一个值得追踪的信号。

## 还在打架 / 没解决的问题

1. **"World model" 到底是什么**：生成派、JEPA 派、可交互派各说各话，benchmark 强行把它们拉进同一个跑分，但底层哲学没有合流。
2. **长时一致性的天花板**：Genie 3 的"分钟级"是当前 SOTA，但离一个真正能让 agent 长时间训练的 simulator 还差几个量级。
3. **物理是否真在被学到**：Sora 2 的篮球反弹 demo 很漂亮，但反例（穿模、守恒律破坏）依然遍地，没人能给出"physical understanding"的量化判据 —— WorldArena 也只是测了 16 个 proxy 指标。
4. **可玩 vs. 物理 vs. 空间**：游戏派要的是 frame-level 控制和长时记忆；机器人/驾驶派要的是物理保真和 sim-to-real；空间派（Marble）要的是导出可用的 3D 资产。这三种"world model"未来会合流还是分裂，目前没人敢断言。
5. **评测体系本身的合法性**：WorldArena 自己也得证明 EWMScore 跟下游真机器人成功率相关；WorldMark 还得证明它的 500 个测试案例能区分模型的真实能力 —— 评测体系还没到 ImageNet 那种被广泛承认的稳定期。
6. **闭源旗舰为何缺席榜单**：Sora 2、Veo 3、Genie 3、Marble 都没在 WorldArena 跑过完整 functional utility 评测。在它们入场前，所有"谁是 world model SOTA"的判断都打了折扣。

## 调研覆盖的源

1. WorldArena 项目门户 — [world-arena.ai](https://world-arena.ai/)
2. WorldArena GitHub — [github.com/tsinghua-fib-lab/WorldArena](https://github.com/tsinghua-fib-lab/WorldArena)
3. WorldArena 论文 — [arXiv:2602.08971](https://arxiv.org/abs/2602.08971)
4. WorldMark / World Model Arena — [arXiv:2604.21686](https://arxiv.org/abs/2604.21686)
5. Ha & Schmidhuber, World Models — [arXiv:1803.10122](https://arxiv.org/abs/1803.10122)
6. DreamerV3 — [arXiv:2301.04104](https://arxiv.org/abs/2301.04104)
7. Genie — [arXiv:2402.15391](https://arxiv.org/abs/2402.15391)
8. Genie 2 blog — [deepmind.google](https://deepmind.google/blog/genie-2-a-large-scale-foundation-world-model/)
9. Sora 技术报告 — [openai.com](https://openai.com/index/video-generation-models-as-world-simulators/)
10. Sora 2 — [openai.com/sora-2](https://openai.com/index/sora-2/)
11. Decart Oasis — [oasis-model.github.io](https://oasis-model.github.io/)
12. Microsoft Muse / WHAM — [microsoft.com 博客](https://www.microsoft.com/en-us/research/blog/introducing-muse-our-first-generative-ai-model-designed-for-gameplay-ideation/)
13. Meta V-JEPA 2 论文 — [arXiv:2506.09985](https://arxiv.org/abs/2506.09985)
14. Wayve GAIA-2 — [wayve.ai/press](https://wayve.ai/press/wayve-unveils-gaia2/)
15. Wayve GAIA-3 — [wayve.ai/thinking](https://wayve.ai/thinking/gaia-3/)
16. NVIDIA Cosmos — [nvidia.com/ai/cosmos](https://www.nvidia.com/en-us/ai/cosmos/)
17. 1X World Model — [1x.tech](https://www.1x.tech/discover/1x-world-model)
18. Beyond FVD — [arXiv:2410.05203](https://arxiv.org/abs/2410.05203)
19. Critiques of World Models — [arXiv:2507.05169](https://arxiv.org/abs/2507.05169)
