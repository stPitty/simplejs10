const textWithTooltips = Array.from(document.querySelectorAll('.has-tooltip'));
const tooltipPositionDefault = 'bottom';
let tooltipStorage;


function getTooltipWidth(tooltip) {
  const fakeTooltip = tooltip.cloneNode(true);
  document.body.insertAdjacentElement('afterend', fakeTooltip)
  fakeTooltip.classList.add('tooltip_active')
  const width = fakeTooltip.offsetWidth;
  fakeTooltip.remove()
  return width
}

function moveTooltip(tooltip, mainText) {
  const style = getComputedStyle(tooltip);
  const padding = Number(style.paddingTop.split('px')[0]) + Number(style.paddingBottom.split('px')[0]);

  switch (tooltip.dataset.position) {
    case 'bottom':
      tooltip.style.left = mainText.offsetLeft + 'px';
      break
    case 'top':
      tooltip.style.left = mainText.offsetLeft + 'px';
      tooltip.style.top = mainText.offsetTop - mainText.offsetHeight - padding + 'px';
      break
    case 'left':
      tooltip.style.left = mainText.offsetLeft - getTooltipWidth(tooltip) + 'px';
      tooltip.style.top = mainText.offsetTop - padding + 'px';
      break
    case 'right':
      tooltip.style.left = mainText.offsetLeft + mainText.offsetWidth + 'px';
      tooltip.style.top = mainText.offsetTop - padding + 'px';
      break
  }
}


textWithTooltips.forEach((tooltipText) => {
  const newTooltip = document.createElement('div')
  newTooltip.className = 'tooltip';
  newTooltip.textContent = tooltipText.title;
  newTooltip.style.position = 'absolute';
  newTooltip.dataset.position = tooltipText.dataset.position || tooltipPositionDefault;

  tooltipText.insertAdjacentElement('afterend', newTooltip);

  tooltipText.onclick = () => false;

  tooltipText.addEventListener('click', () => {
    moveTooltip(newTooltip, tooltipText)

    newTooltip.classList.toggle('tooltip_active');
    if (tooltipStorage && (tooltipStorage !== newTooltip)) {
      tooltipStorage.classList.remove('tooltip_active')
    }
    tooltipStorage = newTooltip
  })
})