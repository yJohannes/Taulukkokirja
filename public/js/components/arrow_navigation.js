
function initArrowNavigation()
{
    document.querySelectorAll(".button-group").forEach(group => {
        const buttons = Array.from(group.querySelectorAll("button"));

        group.addEventListener("keydown", (event) => {
            const currentIndex = buttons.indexOf(document.activeElement);
            
            if (group.classList.contains("tab-skip")) {
                if (event.key === "Tab") {
                    for (let i = 0; i < buttons.length; i++) {
                        if (event.shiftKey) {
                            const next = document.activeElement?.previousElementSibling;
                            next?.focus();

                        } else {
                            const prev = document.activeElement?.nextElementSibling;
                            prev?.focus();
                            
                        }
                    }
                }
            }

            if ((event.key === "ArrowRight") || (event.key === "ArrowDown")) {
                event.preventDefault();
                let nextIndex = (currentIndex + 1) % buttons.length;
                let next = buttons[nextIndex];

                next.focus();

                console.log("Active element:", document.activeElement);
                console.log(buttons[nextIndex])
            } else if ((event.key === "ArrowLeft") || (event.key === "ArrowUp")) {
                event.preventDefault();
                let prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                let prev = buttons[prevIndex];
                prev.focus();
            }
        });
    });
}

export { initArrowNavigation };