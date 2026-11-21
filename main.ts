
namespace pixelMenu {
    let menuItems: string[] = []
    let selected = 0
    let scrollOffset = 0

    let menuTitle = "MICRO:BIT CONSOLE"
    let menuSprite: Sprite = null

    let menuWidth = 150
    let menuHeight = 112

    let backgroundColor = 1
    let textColor = 7
    let highlightColor = 9
    let highlightTextColor = 1

    let selectHandler: (index: number, item: string) => void = null
    let menuVisible = false
    let controlsRegistered = false

    function visibleRows(): number {
        return Math.max(1, Math.floor((menuHeight - 28) / 15))
    }

    function redraw() {
        if (!menuSprite) return

        let img = image.create(menuWidth, menuHeight)
        img.fill(backgroundColor)

        img.print(menuTitle, 5, 5, highlightColor)
        img.drawLine(5, 18, menuWidth - 5, 18, highlightColor)

        let rows = visibleRows()

        for (let row = 0; row < rows; row++) {
            let i = scrollOffset + row

            if (i >= menuItems.length) break

            let y = 25 + row * 15

            if (i == selected) {
                img.fillRect(4, y - 2, menuWidth - 8, 13, highlightColor)
                img.print(">", 7, y, highlightTextColor)
                img.print(menuItems[i], 17, y, highlightTextColor)
            } else {
                img.print(menuItems[i], 17, y, textColor)
            }
        }

        // Scroll indicators
        if (scrollOffset > 0) {
            img.print("^", menuWidth - 12, 22, highlightColor)
        }

        if (scrollOffset + rows < menuItems.length) {
            img.print("v", menuWidth - 12, menuHeight - 10, highlightColor)
        }

        menuSprite.setImage(img)
    }

    function moveSelection(direction: number) {
        if (!menuSprite || !menuVisible || menuItems.length == 0) return

        selected += direction

        if (selected < 0) {
            selected = menuItems.length - 1
        }

        if (selected >= menuItems.length) {
            selected = 0
        }

        let rows = visibleRows()

        if (selected < scrollOffset) {
            scrollOffset = selected
        }

        if (selected >= scrollOffset + rows) {
            scrollOffset = selected - rows + 1
        }

        redraw()
    }

    function registerControls() {
        if (controlsRegistered) return
        controlsRegistered = true

        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            moveSelection(-1)
        })

        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            moveSelection(1)
        })

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (!menuSprite || !menuVisible || menuItems.length == 0) return

            if (selectHandler) {
                selectHandler(selected, menuItems[selected])
            }
        })
    }

    //% block="create Micro:Bit Console menu"
    //% blockId=pixelmenu_create
    //% weight=100
    export function create() {
        registerControls()

        menuItems = []
        selected = 0
        scrollOffset = 0
        menuVisible = true

        if (menuSprite) {
            menuSprite.destroy()
        }

        menuSprite = sprites.create(
            image.create(menuWidth, menuHeight),
            SpriteKind.Player
        )

        menuSprite.setPosition(80, 64)
        redraw()
    }

    //% block="set menu title to $name"
    //% blockId=pixelmenu_set_title
    //% name.defl="MICRO:BIT CONSOLE"
    //% weight=90
    export function setTitle(name: string) {
        menuTitle = name
        redraw()
    }

    //% block="add menu item $name"
    //% blockId=pixelmenu_add_item
    //% name.defl="PLAY"
    //% weight=80
    export function addItem(name: string) {
        menuItems.push(name)
        redraw()
    }

    //% block="set menu size width $width height $height"
    //% blockId=pixelmenu_set_size
    //% width.min=40 width.max=160 width.defl=150
    //% height.min=35 height.max=120 height.defl=112
    //% weight=70
    export function setSize(width: number, height: number) {
        menuWidth = Math.max(40, Math.min(160, width))
        menuHeight = Math.max(35, Math.min(120, height))

        if (menuSprite) {
            menuSprite.setImage(image.create(menuWidth, menuHeight))
            redraw()
        }
    }

    //% block="set menu position x $x y $y"
    //% blockId=pixelmenu_set_position
    //% x.min=0 x.max=160 x.defl=80
    //% y.min=0 y.max=120 y.defl=64
    //% weight=60
    export function setPosition(x: number, y: number) {
        if (menuSprite) {
            menuSprite.setPosition(x, y)
        }
    }

    //% block="set menu colors background $bg text $txt highlight $hi selected text $sel"
    //% blockId=pixelmenu_set_theme
    //% bg.min=0 bg.max=15 bg.defl=1
    //% txt.min=0 txt.max=15 txt.defl=7
    //% hi.min=0 hi.max=15 hi.defl=9
    //% sel.min=0 sel.max=15 sel.defl=1
    //% weight=50
    export function setTheme(bg: number, txt: number, hi: number, sel: number) {
        backgroundColor = bg
        textColor = txt
        highlightColor = hi
        highlightTextColor = sel
        redraw()
    }

    //% block="show Micro:Bit Console menu"
    //% blockId=pixelmenu_show
    //% weight=40
    export function show() {
        if (!menuSprite) return

        menuVisible = true
        menuSprite.setFlag(SpriteFlag.Invisible, false)
        redraw()
    }

    //% block="hide Micro:Bit Console menu"
    //% blockId=pixelmenu_hide
    //% weight=30
    export function hide() {
        if (!menuSprite) return

        menuVisible = false
        menuSprite.setFlag(SpriteFlag.Invisible, true)
    }

    //% block="when Micro:Bit Console menu item selected"
    //% blockId=pixelmenu_on_select
    //% draggableParameters="reporter"
    //% weight=20
    export function onSelect(handler: (index: number, item: string) => void) {
        selectHandler = handler
    }

    //% block="selected menu index"
    //% blockId=pixelmenu_selected_index
    //% weight=10
    export function selectedIndex(): number {
        return selected
    }
}
