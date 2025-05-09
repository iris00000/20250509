// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleRadius = 50; // 圓的半徑

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 圓的初始位置設為視窗中間
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製圓
  fill(0, 0, 255, 150); // 半透明藍色
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手指上的圓與線條
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        stroke(0, 255, 0);
        strokeWeight(2);

        // 繪製手指的線條
        for (let i = 0; i < 4; i++) {
          line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
        }
        for (let i = 5; i < 8; i++) {
          line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
        }
        for (let i = 9; i < 12; i++) {
          line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
        }
        for (let i = 13; i < 16; i++) {
          line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
        }
        for (let i = 17; i < 20; i++) {
          line(hand.keypoints[i].x, hand.keypoints[i].y, hand.keypoints[i + 1].x, hand.keypoints[i + 1].y);
        }

        // 檢測食指（keypoints 8）與大拇指（keypoints 4）是否同時碰觸圓的邊緣
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dIndex < circleRadius && dThumb < circleRadius) {
          // 如果食指與大拇指同時碰觸圓，讓圓跟隨食指移動
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }
      }
    }
  }
}
