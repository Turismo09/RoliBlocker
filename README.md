# RoliBlocker

Filter out duplicate trade ads and block annoying players on [rolimons.com](https://www.rolimons.com/).

## What it does

- Hides duplicate ads (same player, same items)
- Blocks specific users by their Roblox ID
- Settings saved in your browser

## Install

1. Get [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Click the extension → **Create a new script**
3. Paste the contents of `script.js`
4. Save (`Ctrl+S`)

## How to use

Once installed, you'll see a blue button in the bottom-right corner on rolimons. Click it to open settings.

**Settings:**
- Toggle duplicate filtering on/off
- Toggle player blocking on/off  
- Add user IDs to block (one per line)

You can add comments to your block list:
```
12345678 // reason here
87654321
```

Hit **Save Settings** and the page reloads with your filters applied.

## Logs

Open dev console (`F12`) to see what got filtered:
```
[RF] - 5 dupes, - 2 blocked
```

## Disclaimer

This script will always be free. Do not trust anyone who attempts to sell you a version of this.

Be wary that this is the only official version of RoliBlocker.
Malicious people may make Github Repos with similar usernames or give you malicious edited code from this official open-source.
