modulejs.define('utils', () => {
  function getItemUrl(itemName) {
    const url = new window.URL(window.location.href);
    url.searchParams.set('item', `^${itemName}$`);
    return url.toString();
  }

  function getItemImageUrl(itemName) {
    const imageId = itemImageIds[itemName];
    return `https://github.com/lukehorvat/el-userscripts/raw/item-images/dist/item-image-${
      imageId ?? 'placeholder'
    }.jpg`;
  }

  function getItemWikiUrl(itemName) {
    return `https://el-wiki.holy-eternalland.de/index.php?search=${encodeURIComponent(
      itemName
    )}`;
  }

  return { getItemUrl, getItemImageUrl, getItemWikiUrl };
});
