"strict mode";

const photographs = require("./data.json");
const imagesOnly = photographs.flatMap((photo) => photo.images);

// Local images
const images = imagesOnly.map((img, i) => ({
  ...img,
  image_id: i,
}));
// const images = require("./images.json").images.map((img, i) => ({
//   ...img,
//   image_id: i,
// }));
module.exports = {
  images,
  fetchList: async function (from, count) {
    return images; //.slice(from, from + count); //.map((img,i)=>({...img, image_id:i+from}));
  },
  fetchImage: async function (obj, advicedResolution) {
    const url = obj.file;
    const blob = await fetch(url).then((res) => res.blob());
    return {
      title: obj.title,
      desc: obj.desc,
      image: blob,
      author_id: obj.author_id,
    };
  },
  fetchAuthorDetail: async function (id) {
    const author = photographs.find((photo) => photo.id === id);
    return {
      name: author.name,
      desc: author.bio,
      images: author.images.length,
    };
  },
};
