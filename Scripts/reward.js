// Container
const container = document.getElementById("container");
// Size of container
let containerRect = container.getBoundingClientRect();
let containerWidth = containerRect.width;
let containerHeight = containerRect.height;

let delay = 0;

// Background color for paper
const colors = [
  "#DF4678",
  "#00CECB",
  "#995AE2",
  "#FFC857",
  "#CA3B4E"
];
// Number of colors
const colorsLength = colors.length;

// Delta position for control points
const delta = 100;

// Make confetti
function confetti() {
  // Prevent click button many times
  if (delay) return;
  delay = setTimeout(() => {
    delay = 0;
  }, 1000);
  // Re get container size
  containerRect = container.getBoundingClientRect();
  containerWidth = containerRect.width;
  containerHeight = containerRect.height;

  // Create paper
  for (let i = 0; i < 200; i++) {
    // Paper
    const div = document.createElement("div");
    div.classList.add("paper");
    div.style.background = colors[getRandomNumber(0, colorsLength - 1)];
    container.appendChild(div);

    // Init propertive for paper
    const scaleX = getRandomNumber(5, 20) / 10;
    const scaleY = getRandomNumber(5, 20) / 10;

    // Set transform propertive for paper
    TweenLite.set(div, { skewX: getRandomNumber(-30, 30) + "deg" });
    TweenLite.set(div, { skewY: getRandomNumber(-30, 30) + "deg" });
    TweenLite.set(div, { scaleX: scaleX });
    TweenLite.set(div, { scaleY: scaleY });

    //if (scaleX > 1.8 && scaleY > 1.8) {
      //div.style.boxShadow = "0px 0px 5px 1px";
      //div.style.border = "solid 2px rgba(247, 247, 247, 0.3)";
      div.style.filter = "blur("+Math.abs(i/50-2)+"px)";
    //}

    // Animation motion path
    const firstPathResult = generateFirstPath();
    const firstPath = MorphSVGPlugin.pathDataToBezier(firstPathResult.path);
    const lastPath = MorphSVGPlugin.pathDataToBezier(
      generateLastPath(firstPathResult.endPoint)
    );

    // Time for animation
    let firstTime = getRandomNumber(500, 1500, 100) / 1000;
    // Caculate last time base on distance
    let lastTime =
      2 *
        Math.min(Math.abs(firstPathResult.endPoint[1] / containerHeight), 0.8) +
      getRandomNumber(-5, 5) / 10;
    lastTime = Math.max(firstTime, lastTime);
    // Make animation
    new TimelineMax()
      .to(div, firstTime, {
        bezier: { values: firstPath, type: "cubic" },
        ease: Power1.easeOut,
        rotationY: "+=" + getRandomNumber(360, 1080),
        rotationX: "+=" + getRandomNumber(360, 1080)
      })
      .to(div, lastTime, {
        bezier: { values: lastPath, type: "cubic" },
        ease: Power1.easeIn,
        rotationY: "+=" + getRandomNumber(360, 1080),
        rotationX: "+=" + getRandomNumber(360, 1080),
        onComplete: () => {
          div.remove();
        }
      });
  }
}

function generateFirstPath() {
  const startPoint = [getRandomNumber(-delta, 0), getRandomNumber(0, delta)];
  const endPointY = getRandomNumber(-containerWidth * 4 / 5, 20);
  let endPointX = 0;
  if (Math.abs(endPointY) > containerHeight / 2) {
    endPointX = getRandomNumber(containerWidth / 4, containerWidth * 3 / 4);
  } else {
    endPointX = getRandomNumber(0, containerWidth * 4 / 5);
  }
  const endPoint = [endPointX, endPointY];
  const controlPoint1 = [
    getRandomNumber(startPoint[0] - delta / 2, startPoint[0]),
    getRandomNumber(startPoint[1] + delta, startPoint[1] + 2 * delta)
  ];
  const controlPoint2 = [
    getRandomNumber(endPoint[0] - delta / 2, endPoint[0]),
    getRandomNumber(endPoint[1] - 2 * delta, endPoint[1] - delta)
  ];
  return {
    path: `M ${startPoint.join(",")} 
        C ${controlPoint1.join(",")} ${controlPoint2.join(",")} ${endPoint.join(
      ","
    )}`,
    endPoint: endPoint
  };
}

function generateLastPath(startPoint) {
  let endPointX = 0;
  if (Math.abs(startPoint[1]) > containerHeight / 2) {
    endPointX = getRandomNumber(
      startPoint[0] + delta,
      startPoint[0] + 3 * delta
    );
  } else {
    endPointX = getRandomNumber(
      startPoint[0] - delta / 2,
      startPoint[0] + 2 * delta
    );
  }
  const endPoint = [endPointX, getRandomNumber(0, delta)];
  const controlPoint1 = [
    getRandomNumber(startPoint[0] - delta, startPoint[0] + delta),
    getRandomNumber(startPoint[1], startPoint[1] + 2 * delta)
  ];
  const controlPoint2 = [
    getRandomNumber(endPoint[0] - delta, endPoint[0] + delta),
    getRandomNumber(endPoint[1] - 2 * delta, endPoint[1])
  ];
  return `M ${startPoint.join(",")} 
        C ${controlPoint1.join(",")} ${controlPoint2.join(",")} ${endPoint.join(
    ","
  )}`;
}

function getRandomNumber(start, end, step = 1) {
  const numberOfVariants = Math.floor((end - start) / step + 1);
  return Math.floor(Math.random() * numberOfVariants) * step + start;
}
