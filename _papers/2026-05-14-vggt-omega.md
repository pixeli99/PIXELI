---
title: "VGGT-Ω: Scaling Feed-Forward 3D Reconstruction with Efficient Architecture and Self-Supervised Learning"
date: 2026-05-14
authors: Meta AI / Oxford VGG
venue: CVPR 2026 (Oral)
link: https://arxiv.org/abs/2605.15195
tags: [3D, Spatial, Self-supervised, Scaling]
math: true
---

## 一句话

把 VGGT 重构成一个"可预测 scale"的 3D reconstruction backbone：单 head、register-based 跨帧聚合、加 self-supervised 视频预训练，监督数据吃到上一代 15×。

## 方法

三个改动：

- **single dense prediction head**：原 VGGT 是多任务多头（depth / camera / point），现在合成一个 head，每个像素吐 9D 张量（depth + cam intrinsic/extrinsic + confidence），架构上更像 DUSt3R 但参数共享更彻底
- **register attention**：跨帧不做全连接 attention，而是每帧加几个 register token，帧间只通过 register 交换信息。GPU 显存降约 30%，长序列才跑得动
- **self-supervised 阶段**：用未标注视频做 photometric / cycle consistency loss，把训练数据扩到 supervised 的 15 倍

关键数字：Sintel camera pose 误差比上代降 77%。learned register 还能被 VLA 复用作为 spatial token，下游 robotics policy 能直接搭。

scaling law 形式：loss vs. model+data 在 log-log 上是直线，文中给出 visual reconstruction 上类似 LLM 的 scaling 指数（具体 $\alpha$ 数字在附录）。

## 想法

把 3D reconstruction 从"特征工程 + multi-head"推到"single transformer + scale up"这条路其实早该有人正经做。register attention 看起来是这次能 scale 的关键——dense pairwise 帧间 attention 在视频长度 >100 帧就跑不动。

77% 的 Sintel 提升数字很猛，但 Sintel 是合成数据，希望看到 KITTI / ScanNet 上的对比。dynamic scene 的 pipeline 用了自家"高质量标注流程"——这种 data engine paper 通常要等开源才知道是 method 厉害还是 data 厉害。

VLA 那段是 selling point 但写得太短，register token 怎么接进 OpenVLA / RT-2-style policy 没讲。

## 引用

{% raw %}
```bibtex
@inproceedings{wang2026vggtomega,
  title     = {VGGT-$\Omega$: Scaling Feed-Forward 3D Reconstruction with Efficient Architecture and Self-Supervised Learning},
  author    = {Wang, Jianyuan and Chen, Minghao and Zhang, Shangzhan and Karaev, Nikita and Sch\"onberger, Johannes and Labatut, Patrick and Bojanowski, Piotr and Novotny, David and Vedaldi, Andrea and Rupprecht, Christian},
  booktitle = {CVPR},
  year      = {2026}
}
```
{% endraw %}
