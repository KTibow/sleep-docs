---
layout: default
title: Awake detection
nav_order: 2
parent: Sleep - basic features
---

# Awake detection
Since actigraphy is not powerful enough to distinguish you being awake in the bed and not moving  from being out of bed for toilet, sleep uses several tricks to estimate your awakes periods - like measuring the light, phone position,  and heart rate peaks.

**Where to find it:**
_Settings > Sleep tracking > Awake detection_

**What it does:**
Estimates your awake periods using either light detection, heart rate detection, detection of using a phone or pause feature.

**Options**
* **Movement intensity** - estimated from awake like events based on acceleration threshold 
* **Heart rate monitoring** - your heart beats up to 10 BPM slower
* **Light** - the ambient light sensor measures the level of ambient light in your bedroom
  * If there is disturbing light (more than 30 lux) after sunset, we consider it as an Awake period.
  * The #dark tag is added when you have less than 30 lux for at least 90% of the night.
  * The #light tag is added when you have more than 60 lux for at least 33% of the night.
* **Talk** - the talk-like sounds (talking, baby cry or cough) indicates awake
  * 45 minutes after beginning of tracking and 1 hour before alarm for automatic tracking
  * at least 4 talk-like events in last minute for manutal tracking start
* **Snooze** - any snooze or pause result into awake

* **Awake when using phone** - adds awake automatically when the phone is held in unusal position or used
* **Delayed sleep tracking** - you can configure automatic pause time at sleep tracking start if you know your typical fall asleep sequence
* **Flip to pause** - allows you to add 5 min pause by flipping the phone

## Pause
Use the sleep tracking pause feature whenever you are tracking but not sleeping.

* **Pause button**
  * available from sleep tracking screen
  * displays the time left
  * finish without your further interaction
  * You may add +5 minutes anytime.
 
* **Volume / camera buttons**
  * _Settings > Sleep tracking > Volume and camera button effect_
  * adds 5 minutes every time your press the volume of camera buttons
  * when screen off - press the power button and than one of the volume buttons or camera button
 
> You can also edit your sleep graph ex-post in order to correct your wake up or before fall asleep periods. This can be done in the sleep graph detail screen. Graph detail screen is displayed, when you click on  a graph on the screen that lists all your recordings. You can select the related portion of the sleep graph and choose MENU > Delete selected

---
## How to...

## Troubleshooting
* Whole night has been estimated as awake
* Too much awakes (false positive)