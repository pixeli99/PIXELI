---
title: "WorldArena: A Unified Benchmark for Evaluating Perception and Functional Utility of Embodied World Models"
date: 2026-02-09
authors: 清华大学 FIB Lab
venue: CVPR 2026 Challenge
link: https://arxiv.org/abs/2602.08971
tags: [World Model, Benchmark, Robotics]
math: true
---

## 一句话

把 14 个主流 world model 拉进同一套评测，既测视觉感知质量、也测下游 embodied 任务可用性，最后压成一个 EWMScore——结论是"画得漂亮的不一定能用"。

## 方法

两条 track：

- **Track 1 视觉感知**：16 个指标分布在 6 个子维度——visual quality、motion quality、content consistency、physics adherence、3D accuracy、controllability。覆盖 FVD 类指标做不到的物理一致性和 3D 几何。
- **Track 2 功能效用**：把 world model 当成三种工具来用——synthetic data engine（生成数据训 policy）、policy evaluator（替代真机评测）、action planner（rollout 用于规划）。

**EWMScore** 是把上面这一堆指标加权聚合成一个 [0,1] 区间的总分，方便排行。但论文里的核心发现是 score 不是越高越好——他们在 14 个模型上跑出感知分和功能分的强解耦：

$$
\rho(\text{perception score}, \text{functional score}) \ll 1
$$

也就是说，让 FVD/CLIP-T 等"显示器友好"指标好看的工作，未必能让下游 policy 跑得更好——存在显著的 **perception-functionality gap**。

配套 CVPR 2026 Workshop on Video World Models 的 challenge，2026-06-25 在 Denver 现场。

## 想法

这套 benchmark 真正解决了一个 community 痛点：每家公司各自报自家 cherry-picked 视频，看不出来谁更接近"能用"。把 14 个模型放一起跑同一套 prompt 才有可比性。

EWMScore 单点化是双刃——leaderboard 好看，但 perception 和 functional 的解耦本身才是 paper 的核心 message，压成一个数会反过来掩盖它。希望 challenge 维度里保留 sub-score 而不是只 rank 总分。下一步看 Track 2 的 task 设定是否被社区接受为标准，否则又会回到 FVD 时代。

## 引用

{% raw %}
```bibtex
@article{tsinghua2026worldarena,
  title   = {WorldArena: A Unified Benchmark for Evaluating Perception and Functional Utility of Embodied World Models},
  author  = {{Tsinghua FIB Lab}},
  journal = {arXiv preprint arXiv:2602.08971},
  year    = {2026}
}
```
{% endraw %}
