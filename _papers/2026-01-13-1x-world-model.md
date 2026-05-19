---
title: "1X World Model: Evaluating Bits, not Atoms"
date: 2026-01-13
authors: 1X Technologies
venue: 博客 / 技术报告
link: https://www.1x.tech/discover/1x-world-model
tags: [World Model, Robotics, Generative, Video]
---

## 一句话

1X 把 world model 当作人形机器人 NEO 的认知核心：用 14B 视频生成模型在 ego-centric 人类视频上预训，再在机器人数据上微调，让 NEO 通过"想象未来视频"来导出动作。

## 方法

不同于把 action token 直接预测的 VLA，1X 把控制问题拆成两步：

1. **video imagination**：14B backbone 在条件（当前视图 + 文本指令）下生成一段未来 ego-centric 视频，描绘"如果按指令做，画面会怎么演化"。
2. **inverse dynamics**：一个独立的小模型把生成视频反解成 NEO 关节级动作。

训练用了 multi-stage：

- **egocentric mid-training**：900 小时第一人称人类视频。
- **embodiment fine-tuning**：70 小时 NEO 的遥操作真机数据，对齐机器人本体的外观和运动学。

效果上 NEO 在简单任务上的 success rate 显著上去（"抓薯片"、"熨衬衫"等），但复杂多步任务（"倒麦片"、"画笑脸"）成功率仍接近 0%。1X 把它叫"评测 bits，而不是 atoms"——意思是用 world model rollout 来量产评测，不必每条 trajectory 都在真机上跑。

## 想法

video-imagination + inverse-dynamics 这种解耦看起来比端到端 VLA 更优雅：world model 负责长程语义，inverse dynamics 负责短程控制。两边都能各自 scale，问题边界清楚。

风险也直接：生成视频里出现 NEO 物理上做不到的姿态，inverse dynamics 必须能识别并拒绝；否则就是 "想得到、做不到" 的优雅幻觉。1X 没在博客里给这条 rejection rate，反而高调放成功 demo——这是典型选择性披露，复杂任务那条 0% 才是真消息。

## 引用

```bibtex
@misc{1x2026worldmodel,
  title  = {1X World Model: Evaluating Bits, not Atoms},
  author = {{1X Technologies}},
  year   = {2026},
  month  = {1},
  howpublished = {\url{https://www.1x.tech/1x-world-model.pdf}}
}
```
