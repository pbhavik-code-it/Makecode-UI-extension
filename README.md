# PIXELBIT UI

A starter menu extension for Microsoft MakeCode Arcade.

## Add the extension to a project

1. Publish this repository to GitHub.
2. In MakeCode Arcade, open your game project.
3. Choose **Extensions**.
4. Paste the GitHub repository URL.

## Example

```typescript
pixelMenu.create()
pixelMenu.setTitle("PIXELBIT OS")
pixelMenu.setTheme(1, 7, 9, 1)
pixelMenu.addItem("PLAY")
pixelMenu.addItem("SETTINGS")
pixelMenu.addItem("HIGH SCORES")
pixelMenu.addItem("ABOUT")
pixelMenu.setPosition(80, 60)
pixelMenu.show()

pixelMenu.onSelect(function (index, item) {
    game.splash(item)
})
```

## Notes

- The menu uses the standard 160x120 MakeCode Arcade coordinate space.
- UP and DOWN navigate; A selects.
- Colour values are MakeCode Arcade palette indices (0-15).
- This is an initial starter version. Test in the simulator before flashing hardware.
