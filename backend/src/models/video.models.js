const db = require('../db/db');

// create video
const createVideo = (videoData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO videos (uri, title, teacher_id)
      VALUES (?, ?, ?)
    `;

    db.query(
      query,
      [videoData.uri, videoData.title, videoData.teacher_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// get all videos
const getAllVideos = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT videos.*, users.username AS teacher_name
      FROM videos
      JOIN users ON videos.teacher_id = users.id
    `;

    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  createVideo,
  getAllVideos
};