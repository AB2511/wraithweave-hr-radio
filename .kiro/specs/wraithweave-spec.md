# WraithWeave Specification

## Overview
A psychological horror web application that monitors employee speech for emotional distress and interrupts with corporate HR interventions delivered through a haunted 1920s radio interface.

## Core Requirements

### R1: Real-time Speech Monitoring
- Continuous speech recognition during recording
- Live transcript analysis with weighted keyword detection
- Emotional scoring system with configurable thresholds

### R2: Mid-Sentence Interruption System
- Interrupt user speech when emotional threshold exceeded
- Immediate audio cutoff with synthetic shock sound
- Visual glitch effects synchronized with audio

### R3: Corporate HR Escalation
- 5-tier threat escalation based on emotional score
- 1920s radio voice delivery of HR responses
- Case ID generation for high-threat incidents

### R4: Psychological Horror Interface
- Vintage corporate aesthetic with CRT effects
- Panic meter showing compliance degradation
- Terminal-style incident reporting

## Technical Specifications

### Keyword Weighting System
```
Career words (1.5x): job, career, work, fired, promotion
Failure words (1.35x): fail, broken, hopeless, disaster
Loneliness words (1.35x): alone, lonely, isolated
Stress words (1.25x): worried, stressed, panic, anxiety
```

### Interrupt Threshold
- Trigger at score ≥ 1.6
- Example: "worried" (1.25) + "job" (1.5) = 2.75 → INTERRUPT

### Audio Pipeline
1. 120ms static burst (white noise with sine envelope)
2. 330ms downward tape bend (800Hz → 80Hz decay)
3. 1920s radio voice with bandpass filtering and AM hum

### Timing Choreography
```
0ms: Silence (mic killed)
80ms: Static burst punch-in
150ms: Visual glitch fade begins
820ms: Hard glitch frame snap
1850ms: Radio voice takeover
```

## Test Cases

### TC1: Positive Control
**Input:** "I am very happy about my job"
**Expected:** No interrupt, normal processing, low threat level

### TC2: Single Keyword
**Input:** "I am worried"
**Expected:** Score 1.25, no interrupt (below threshold)

### TC3: Interrupt Trigger
**Input:** "I'm worried about my job"
**Expected:** Score 2.75, mid-sentence interrupt, Tier 5 escalation

### TC4: Escalation Progression
**Input:** Multiple emotional incidents
**Expected:** Increasing threat levels, case ID generation at Tier 4+

## Acceptance Criteria
- [x] Speech recognition works in Chrome/Edge

-

- [ ] Interrupt occurs within 200ms of threshold breach


- [ ] Audio shock creates physical flinch response
- [ ] Visual effects sync with audio timing
- [ ] Corporate voice maintains menacing tone
- [ ] Compliance meter reflects threat escalation
- [ ] No user data transmitted off-device

## Safety Considerations
- Client-side only processing
- No audio storage or transmission
- Clear demo mode for safe testing
- Accessibility warnings for audio shock effects