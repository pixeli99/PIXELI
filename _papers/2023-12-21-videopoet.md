---
title: VideoPoet - A Large Language Model for Zero-Shot Video Generation
date: 2023-12-21
authors: Kondratyuk, Yu, Gu, et al. (Google)
venue: ICML 2024 (Best Paper)
link: https://arxiv.org/abs/2312.14125
tags: [Video, Tokenizer, World Model]
math: false
---

## 一句话

不是 diffusion——把视频、音频、图像全部 tokenize 后塞进一个 decoder-only Transformer，纯 next-token prediction 训出一个支持 text-to-video / image-to-video / video stylization / video-to-audio 的零样本多任务 LLM。

## 方法

- 视频 tokenizer 用 **MAGVIT-v2**（lookup-free quantization，超过 224K 视觉 codebook 等效），把 17 帧 128×224 视频压成 ~1280 个离散 token；音频用 SoundStream 做 RVQ
- 主干 8B decoder-only Transformer，跟 PaLM 同一族；输入是 `<task><text><condition_tokens><output_tokens>` 的混合序列，task 标记决定干什么
- 训练 mixture 含 image-to-video、video continuation、video stylization、inpainting、audio-to-video 等十来项，靠 prefix 控制
- 因为是 AR LLM，可以原生做 long video（continuation）、in-context conditioning，以及把音频和视觉 token 拼在同一序列里跨模态生成
- 评测在 zero-shot text-to-video 的 MSR-VTT / UCF-101 上和当时的 diffusion baseline 打平甚至略胜；最大的卖点是 zero-shot 多任务

## 想法

- 在 Sora 出来之前，VideoPoet 是"video as token sequence" 路线最完整的一次答卷。它的隐含主张是：视频生成不需要 diffusion，diffusion 只是图像的偶然胜利
- 然而 2024 整年的事实是 DiT 完胜——AR + discrete token 的视频质量上限被 codebook 量化噪声卡死，long video 的 exposure bias 也比连续 latent diffusion 严重。VideoPoet 之后 Google 自己也转向了 Veo（diffusion）
- 但这条线没死：MAGVIT-v2 的 tokenizer 后来被几乎所有视频生成工作复用；"video token + LLM" 在多模态 understanding（不是 generation）那一侧反而成主流（Chameleon、Emu3）
- 真正长期的贡献是把"通用视觉生成接口"统一在 LLM 的 prompt 范式里——比 diffusion 的 condition encoder 路线更优雅

## 引用

```bibtex
@inproceedings{kondratyuk2024videopoet,
  title={VideoPoet: A Large Language Model for Zero-Shot Video Generation},
  author={Kondratyuk, Dan and Yu, Lijun and Gu, Xiuye and Lezama, Jos{\'e} and Huang, Jonathan and Hornung, Rachel and Adam, Hartwig and Akbari, Hassan and Alon, Yair and Birodkar, Vighnesh and others},
  booktitle={ICML},
  year={2024}
}
```
