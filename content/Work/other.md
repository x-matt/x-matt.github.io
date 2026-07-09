---
title: Other Eis Summary
type: area
status: active
domain: feature
priority:
review:
tags:

  - eis
---

## 1. Vidhance

### 1.1 应用场景

- FRONT
- SuperEIS
- SuperEISPro

### 1.2 相关命令

#### 开关命令

```bash
adb shell setprop vendor.vidhance.enabled 0
```

#### LogD

```bash
adb shell setprop vendor.vidhance.logging.level 1
```

- Preview 关键字：`PublishIca for PREVIEW`
- Record 关键字：`PublishIca for RECORDING`

#### Dump

```bash
adb shell setprop vendor.vidhance.debug.eisdump 1
```

## 2. Morpho

### 2.1 应用场景

- Capture Preview Zoom
- Moon Mode

## 3. 算法厂商对比

| 算法厂商 | 应用场景                        |
| -------- | ------------------------------- |
| Vidhance | FRONT、SuperEIS、SuperEISPro    |
| Morpho   | Capture Preview Zoom、Moon Mode |
| HIS      | 4K60                            |
| Qcom     | Others                          |

## 4. Margin

| Platform | Relationship                      | e.g.         | Type         |
| -------- | --------------------------------- | ------------ | ------------ |
| MTK      | input = (100+margin)/100 x output | margin = 25  | OutputMargin |
| Qcom     | input(1-margin) = output          | margin = 0.2 | InputMargin  |

> 100/(100+margin_MTK) = 1-margin_Qcom

## 5. SuperEIS

| 产品               | Sensor | EIS-Input | Margin | EIS裁切比例 | EIS-output |
| ------------------ | ------ | --------- | ------ | ----------- | ---------- |
| Mi-Qcom            | Wide   | 2956x2212 | 54     | 35%         | 1920x1080  |
| OPPO-MTK           | UW     | 2720x1536 | 42     | 40%         | 1920x1080  |
|                    | Wide   | 2112x1200 | 10     | 30%         | 1920x1080  |
| Mi-MTK             | Wide   | 2400x1360 | 25     | 35%         | 1920x1080  |
| K11R已经测试的方案 | Wide   | 2960x1664 | 54     | 35%         | 1920x1080  |

### Power

| 项目               | EIS-off-power | EIS-off-Target | superEIS-power | superEIS-Target |
| ------------------ | ------------- | -------------- | -------------- | --------------- |
| K9                 | 667.2         | 650            | 811.93         | 700             |
| K8                 | 785.16        | 810            | 961.88         | 960             |
| K9D                | 581.92        | 650            | 898.63         | 950             |
| K11R               | 617.87        | 600            | 724            | 700             |
| K11R已经测试的方案 | -             | 600            | 794            | 700             |
