"strict mode";

// ARTIC API
const searchURL = "https://api.artic.edu/api/v1/artworks/search";
const imageURL = ({ image_id }, res) =>
  `https://www.artic.edu/iiif/2/${image_id}/full/${res},/0/default.jpg`;
const detailURL = "https://api.artic.edu/api/v1/artworks";
const artistURL = "https://api.artic.edu/api/v1/agents";
const query =
  "?query[bool][must][][term][classification_titles.keyword]=painting&query[bool][must][][term][is_public_domain]=true";
const fields = "&fields=image_id,title,artist_title,id";
const resolutions = { low: 400, mid: 843, high: 1686 };

module.exports = {
  fetchList: async function (from, count) {
    const url = searchURL + query + fields + `&from=${from}&size=${count}`;
    const json = await fetch(url).then((res) => res.json());
    const data = json.data.filter((d) => d.image_id);
    return data;
  },
  fetchDetail: async function (id) {
    const url = detailURL + `/${id}`;
    const storage = localStorage.getItem(`painting-${id}`);
    if (storage) {
      const data = JSON.parse(storage);
      return data;
    } else {
      const json = await fetch(url).then((res) => res.json());
      localStorage.setItem(`painting-${id}`, JSON.stringify(json.data));
      return json.data;
    }
  },
  fetchArtist: async function (id) {
    const url = artistURL + `/${id}`;
    const storage = localStorage.getItem(`artist-${id}`);
    if (storage) {
      const data = JSON.parse(storage);
      return data;
    } else {
      const json = await fetch(url).then((res) => res.json());
      localStorage.setItem(`artist-${id}`, JSON.stringify(json.data));
      return json.data;
    }
  },
  fetchImage: async function (obj, advicedResolution) {
    const url = imageURL(obj, resolutions[advicedResolution]);
    const blob = await fetch(url).then((res) => res.blob());
    return {
      title: obj.title + " - " + obj.artist_title,
      image: blob,
    };
  },
};
