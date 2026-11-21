// PIXELBIT UI - a simple reusable menu engine for MakeCode Arcade
// Initial version: one active menu, UP/DOWN to navigate, A to select.

namespace pixelMenu {
    let menuItems: string[] = []
    let selected = 0
    let menuTitle = "PIXELBIT"
    let menuSprite: Sprite = null
    let menuWidth = 120
    let menuHeight = 100
    let backgroundColor = 1
    let textColor = 7
    let highlightColor = 9
    let highlightTextColor = 1
    let selectHandler: (index: number, item: string) => void = null
    let menuVisible = false

    function redraw() {
        if (!menuSprite) return

        let img = image.create(menuWidth, menuHeight)
        img.fill(backgroundColor)
        img.print(menuTitle, 5, 6, highlightColor)
        img.drawLine(5, 19, menuWidth - 5, 19, highlightColor)

        for (let i = 0; i < menuItems.length; i++) {
            let y = 25 + i * 16
            if (y + 10 >= menuHeight) break

            if (i == selected) {
                img.fillRect(4, y - 2, menuWidth - 8, 14, highlightColor)
                img.print(">", 7, y, highlightTextColor)
                img.print(menuItems[i], 17, y, highlightTextColor)
            } else {
                img.print(menuItems[i], 17, y, textColor)
            }
        }

        menuSprite.setImage(img)
    }

    //% block="create PIXELBIT menu"
    //% blockId=pixelmenu_create
    //% weight=100
    export function create() {
        menuItems = []
        selected = 0
        menuVisible = true

        if (menuSprite) {
            menuSprite.destroy()
        }

        menuSprite = sprites.create(image.create(menuWidth, menuHeight), SpriteKind.Player)
        menuSprite.setPosition(80, 60)
        redraw()
    }

    //% block="set menu title to $name"
    //% blockId=pixelmenu_set_title
    //% name.defl="PIXELBIT OS"
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
    //% width.min=40 width.max=160 width.defl=120
    //% height.min=35 height.max=120 height.defl=100
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
    //% y.min=0 y.max=120 y.defl=60
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

    //% block="show PIXELBIT menu"
    //% blockId=pixelmenu_show
    //% weight=40
    export function show() {
        if (!menuSprite) return
        menuVisible = true
        menuSprite.setFlag(SpriteFlag.Invisible, false)
        redraw()
    }

    //% block="hide PIXELBIT menu"
    //% blockId=pixelmenu_hide
    //% weight=30
    export function hide() {
        if (!menuSprite) return
        menuVisible = false
        menuSprite.setFlag(SpriteFlag.Invisible, true)
    }

    //% block="when PIXELBIT menu item selected"
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

    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!menuSprite || !menuVisible || menuItems.length == 0) return
        selected = (selected + menuItems.length - 1) % menuItems.length
        redraw()
    })

    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!menuSprite || !menuVisible || menuItems.length == 0) return
        selected = (selected + 1) % menuItems.length
        redraw()
    })

    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!menuSprite || !menuVisible || menuItems.length == 0) return
        if (selectHandler) {
            selectHandler(selected, menuItems[selected])
        }
    })
}
