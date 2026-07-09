---
title: Offline Camera
type: area
status: active
domain: work
category: platform
priority:
review:
tags:
  - qcom
  - livp
---

## Learning

> 📃Offline Camera APIs for Realtime Framework Decoupling v2.1

### OpModes

| OpMode                   | Concurrency                                                                                                                                                                                                          | Description                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Realtime_PostProcess     | 1. { Realtime_PostProcess} <br>2. { Realtime_PostProcess ,Temporal_Noise_Reduction} <br>3. { Realtime_PostProcess, Realtime_Warp} <br>4. { Realtime_PostProcess ,Temporal_Noise_Reduction, Realtime_Warp }           | Color Correction Matrix, NR Mode, Edge Mode, ToneMap, Gamma, ColorSpace Transform        |
| Temporal_Noise_Reduction | 1. { Temporal_Noise_Reduction } <br>2. { Temporal_Noise_Reduction, Realtime_PostProcess } <br>3. { Temporal_Noise_Reduction, Realtime_Warp}<br>4. { Temporal_Noise_Reduction, Realtime_PostProcess , Realtime_Warp } | MCTF Control at Session Level                                                            |
| Realtime_Warp            | 1. { Realtime_Warp, Realtime_PostProcess } <br>2. { Realtime_Warp, Temporal_Noise_Reduction } <br>3. { Realtime_Warp, Temporal_Noise_Reduction, Realtime_PostProcess }                                               | Perspective transformation using matrix/grid<br>- **this mode can not enabled isolated** |
| Video_Scaler             | 1. {Video_Scaler}                                                                                                                                                                                                    | Downscaler acceleration (MNDS- **M**ulti-stage **N**oise-aware **D**own **S**caler)      |

```cpp
typedef enum ChiOfflineRTOpMode : UINT32
{
    None_RTOpMode               = 0,            ///< None realtime operation mode
    Realtime_PostProcess        = 1 << 0,       ///< Realtime post process
    Temporal_Noise_Reduction    = 1 << 1,       ///< Realtime temporal noise reduction
    Realtime_Warp               = 1 << 2,       ///< Realtime warp
    Video_Scaler                = 1 << 3,       ///< Realtime video scaler
    Max_RTOpMode                = 1 << 4,       ///< Maximum reatlime operation mode
} CHIOFFLINERTOPMODE;

typedef        UINT32                       CHIOFFLINERTOPMODEMASK；
typedef struct ChiOfflineSessionConfigInfo
{
 ......
    CHIOFFLINERTOPMODEMASK  rtOpModes;
 ......
}

```

### HW ability

```cpp
/// @brief Instance Profile Id
enum IPEHWProfileId
{
    IPEHWProfileIdDefault = 0,        ///< 0  All IQ Modules except MFHDR
    IPEHWProfileIdNPS,                ///< 1  Noise Profile (ANR, TF, ICA1, ICA2) only
    IPEHWProfileIdPPS,                ///< 2  Post Processing Profile (All IQ blocks expect ANR, TF, ICA1, ICA2) only
    IPEHWProfileIdScale,              ///< 3  ScaleProfile (None)
    IPEHWProfileIdNoZoomCrop,         ///< 4  All default profile IQ Modules except fill zoom window
    IPEHWProfileIdIndications,        ///< 5  Profile Indications
    IPEHWProfileIdHDR10,              ///< 6  All IQ Modules process in HDR10 mode. Not a valid profile. need to be removed.
    IPEHWProfileIdICAWarpOnly,        ///< 7  Use ICA1 for grid warping
    IPEHWProfileIdUpscale,            ///< 8  Zoom only profile
    IPEHWProfileIdMFHDR,              ///< 9  NPS and MFHDR IQ modules except PPS. MFHDR & PPS is mutually exclusive
    IPEHWProfileIdExtraTFBlendPass,   ///< 10 Selective additional TF blend pass after main IPE processing
    IPEHWProfileIdPPSLTM,             ///< 11 Contains the following: Chroma Up, CST, Gamma, Chroma Enhancement, LTM
    IPEHWProfileIdVSEBlur,            ///< 12 Profile for default + VSE + Blur
    IPEHWProfileIdTemporalFilter,     ///< 13 NPS modules except ANR
    IPEHWProfileIdEqualization,       ///< 14 Equalization stage, include ANR, TF, HNR, LENR, VSE and DSX
    IPEHWProfileIdAI,                 ///< 15 AI data module includes CMUS, STMP as well
    IPEHWProfileIdAIBokeh,            ///< 16 AI bokeh include PPM as well
    IPEHWProfileId2DLUT,              ///< 17 2D LUT, contains CST, 2D LUT, CV IQ
    IPEHWProfileIdHDRNoisefilter,     ///< Only ANR, inverse gamma with PreLTMgamma, cc,ct for sw HVX HDR.
    IPEHWProfileIdMax                 ///< Invalid
};
```

### Remap

> src/hwl/ipenode/camxipenode.h

```cpp
CAMX_INLINE VOID OverrideProfileAndProcessingType()
{
 if (m_offlineModeMask & CHIRTOPMODE::TemporalNoiseReduction)
                {
                    m_instanceProperty.stabilizationType |= IPEStabilizationType::IPEStabilizationMCTF;
                    m_instanceProperty.profileId          = IPEHWProfileIdNPS;

                    if (m_offlineModeMask & CHIRTOPMODE::RealtimePostProcess)
                    {
                        m_instanceProperty.profileId = (m_offlineModeMask & CHIRTOPMODE::RealtimeWarp) ?
                                   IPEHWProfileId::IPEHWProfileIdDefault :
                                   IPEHWProfileId::IPEHWProfileIdNoZoomCrop;
                    }
                }
                else if (m_offlineModeMask & CHIRTOPMODE::RealtimeWarp)
                {
                    m_instanceProperty.profileId = (m_offlineModeMask & CHIRTOPMODE::RealtimePostProcess) ?
                                                   IPEHWProfileId::IPEHWProfileIdDefault :
                                                   IPEHWProfileId::IPEHWProfileIdICAWarpOnly;
                }
                else if (m_offlineModeMask & CHIRTOPMODE::RealtimePostProcess)
                {
                    m_instanceProperty.profileId = IPEHWProfileId::IPEHWProfileIdPPS;
                }
}
```

## Code

1. opMode: adapter::PostProcMode --> OfflineOpModeValues : OfflineOpModeType
2. rtOpMode: adapter::PostProcModeType --> ChiOfflineRTOpMode

pipeline

1. Realtime: sensor->TFE
2. OfflineReprocess: gme->ofe
3. OfflineY2YReprocess:
