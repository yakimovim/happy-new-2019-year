(function() {
  if (document.createElement("canvas").getContext) {
    if (document.readyState === "complete") renderFurTree();
    else window.addEventListener("DOMContentLoaded", renderFurTree, false);
  } else {
    return;
  }

  var deg = Math.PI / 180;
  var canvas, sky;

  const colors = ["#F5624D", "#CC231E", "#34A65F", "#0F8A5F"];

  function rand(n) {
    return Math.floor(n * Math.random());
  }

  function renderFurTree() {
    canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = "-5";

    document.body.insertBefore(canvas, document.body.firstChild);
    sky = canvas.getContext("2d");

    ResetCanvas();

    window.addEventListener("resize", ResetCanvas, false);
  }

  let depth = 8;

  // Сброс размеров Canvas
  function ResetCanvas() {
    canvas.width = document.body.offsetWidth;
    canvas.height = window.innerHeight;

    text();
    setInterval(text, 2000);


    tree({color: "rgba(15, 138, 95, 0.8)", width: 3});
    tree({color: "lime", width: 0.5});

    spheres(depth, canvas.height * 0.9, 40);
  }

  function tree(args) {
    sky.setTransform();
    sky.beginPath();
    sky.strokeStyle = args.color;
    sky.lineWidth = args.width;
    sky.translate(canvas.width / 2, canvas.height * 0.95);
    sky.moveTo(0, 0);
    sky.rotate(-90 * deg);
    leg(depth, canvas.height * 0.9, 40);
    sky.stroke();
  }

  const angleScale = 0.9;
  const branchRatio = 0.15;
  const branchSize = 0.5;

  // Отрисовка кривой Коха
  function leg(n, len, angle) {
    sky.save(); // Сохраняем текущую трансформацию

    if (n == 0) {
      // Нерекурсивный случай - отрисовываем линию
      sky.lineTo(len, 0);
    } else {
      sky.lineTo(len * branchRatio, 0);

      sky.translate(len * branchRatio, 0);

      sky.save();
      leg(n - 1, len * (1 - branchRatio), angle * angleScale);
      sky.restore();

      sky.moveTo(0, 0);

      sky.save();
      sky.rotate(-angle * deg);
      leg(n - 1, len * branchSize, angle * angleScale);
      sky.restore();

      sky.moveTo(0, 0);

      sky.save();
      sky.rotate(angle * deg);
      leg(n - 1, len * branchSize, angle * angleScale);
      sky.restore();

      sky.moveTo(0, 0);
    }

    sky.restore(); // Восстанавливаем трансформацию
  }

  function spheres(n, len, angle) {
    sky.save(); // Сохраняем текущую трансформацию

    if (n > depth - 4) {
      sky.beginPath();
      var grd = sky.createRadialGradient(len * 0.8, 0, 2, len * 0.8, 0, n + 4);
      grd.addColorStop(0, colors[rand(colors.length)]);
      grd.addColorStop(1, "white");
      sky.fillStyle = grd;
      sky.arc(len * 0.8, 0, n + 2, 0, 2 * Math.PI);
      sky.fill();

      sky.translate(len * branchRatio, 0);

      sky.save();
      spheres(n - 1, len * (1 - branchRatio), angle * angleScale);
      sky.restore();

      sky.moveTo(0, 0);

      sky.save();
      sky.rotate(-angle * deg);
      spheres(n - 1, len * branchSize, angle * angleScale);
      sky.restore();

      sky.moveTo(0, 0);

      sky.save();
      sky.rotate(angle * deg);
      spheres(n - 1, len * branchSize, angle * angleScale);
      sky.restore();

      sky.moveTo(0, 0);
    }

    sky.restore(); // Восстанавливаем трансформацию
  }

  function text() {
    const txt = "Happy New 2019 Year!";

    sky.setTransform();

    sky.font = "bold 70px Georgia";
    sky.fillStyle = colors[rand(colors.length)];

    const textWidth = sky.measureText(txt).width;

    sky.fillText(txt, (canvas.width - textWidth) / 2, 100);
  }
})();
