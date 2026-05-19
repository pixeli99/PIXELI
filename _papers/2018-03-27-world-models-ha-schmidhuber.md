---
title: World Models
date: 2018-03-27
authors: Ha & Schmidhuber
venue: NeurIPS 2018
link: https://arxiv.org/abs/1803.10122
tags: [World Model, RL, Generative]
math: true
---

## 一句话

把 agent 拆成 V（VAE 压视觉到 32 维 latent）+ M（MDN-RNN 在 latent 上预测下一帧分布）+ C（一个 867 参数的线性 controller），先无监督学世界再在"梦里"训策略。

## 方法

- V：卷积 VAE，把 $64\times64$ 像素压到 $z_t \in \mathbb{R}^{32}$
- M：MDN-RNN，输入 $(z_t, a_t, h_t)$，输出下一步 $z_{t+1}$ 的混合高斯 $P(z_{t+1}\mid a_t, z_t, h_t)$，外加一个 temperature $\tau$ 调梦的随机性
- C：极小的线性策略 $a_t = W_c [z_t, h_t] + b_c$，参数量 867，用 CMA-ES 演化
- CarRacing-v0 首次解决（avg score $906\pm21 > 900$），DoomTakeCover 在 $\tau{=}1.15$ 的 dream 里训练，再 zero-shot 迁回真环境拿到 1100 步（baseline 750）
- 关键 trick：调高 $\tau$ 防止 controller 利用 world model 的 exploit（dream 里钻空子）

## 想法

- 这是把"先学 world model，再在 latent 里规划/学策略"这条路彻底点亮的论文，Dreamer 系列基本是这个 V+M+C 的工业化升级
- controller 只有 867 参数还能跑，说明 representation 学好了下游 policy 几乎不需要 capacity——这个观察后来在 representation learning for control 里反复被验证
- 弱点：只 work 在低维像素 + 离散 action 的玩具任务上，MDN-RNN 没法 scale 到长 horizon；dream exploit 也是后续 Dreamer 用 KL balancing 才稳住

## 引用

```bibtex
@inproceedings{ha2018world,
  title     = {Recurrent World Models Facilitate Policy Evolution},
  author    = {Ha, David and Schmidhuber, J{\"u}rgen},
  booktitle = {NeurIPS},
  year      = {2018}
}
```
