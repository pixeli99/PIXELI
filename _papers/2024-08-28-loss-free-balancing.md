---
title: "Auxiliary-Loss-Free Load Balancing Strategy for Mixture-of-Experts"
date: 2024-08-28
authors: Wang et al. (DeepSeek)
venue: arXiv preprint
link: https://arxiv.org/abs/2408.15664
tags: [MoE, DeepSeek, Routing, Training]
math: true
---

## 一句话

不要 auxiliary balance loss，直接在每个 expert 的路由 logits 上加一个会随负载自适应调整的 bias，效果更好还不带梯度污染。

## 方法

传统 aux loss 的问题：它把"均衡"作为 loss 加到语言建模目标上，相当于给路由施加了一个干扰梯度，模型 quality 和 balance 是 trade-off。

本文方法：给每个 expert $i$ 一个标量 bias $b_i$，路由分数改成

$$
s'_{i,t} = s_{i,t} + b_i
$$

只用 $s'$ 选 top-K，但**门控权重还是用原始 $s_{i,t}$**——bias 只影响"选谁"，不影响"选了之后的加权"。每个训练 step 后，看每个 expert 的 token 数偏离均值的方向：过载就 $b_i \mathrel{-}= u$，欠载就 $b_i \mathrel{+}= u$，$u$ 是一个固定的更新速率。

完全不进梯度。在 1B / 3B 规模 DeepSeekMoE 上对比 aux-loss 基线：MaxVio（负载偏差最大值）显著更低，validation loss 同步更低。

## 想法

非常干净的工程动作——其实就是一个负载的 P 控制器，只调"是否选我"的阈值，不动 forward 的 weighting。这一拆解保住了 routing 的可微性，又把 balance 从 loss 项移到了控制项。后来直接被 V3 拿去当默认策略。

可质疑：$u$ 是固定的，论文里手调；如果 batch 之间负载分布抖动很大，理论上需要 adaptive step。还有 sequence-level 的 complement loss 留了一项小的 aux 兜底，说明纯无 loss 在某些极端 case 仍不稳，这里 paper 没展开。

下一步该看：这套和 expert parallelism 下的通信调度联动起来，是不是能进一步把 device-level balance 也并进 bias 控制。

## 引用

```bibtex
@article{wang2024lossfree,
  title   = {Auxiliary-Loss-Free Load Balancing Strategy for Mixture-of-Experts},
  author  = {Wang, Lean and others},
  journal = {arXiv preprint arXiv:2408.15664},
  year    = {2024}
}
```
