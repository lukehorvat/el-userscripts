modulejs.define('utils', () => {
  const ITEM_THUMBNAIL_SIZE = 36;
  const MAP_THUMBNAIL_SIZE = 36;
  const MAP_PREVIEW_SIZE = 250;

  function getItemUrl(itemName) {
    const url = new window.URL(window.location.href);
    url.searchParams.set('item', `^${itemName}$`);
    return url.toString();
  }

  function getItemWikiUrl(itemName) {
    return `https://el-wiki.holy-eternalland.de/index.php?search=${encodeURIComponent(
      itemName
    )}`;
  }

  function getItemImageUrl(itemName) {
    const imageId = itemImageIds[itemName];
    return `https://github.com/lukehorvat/el-userscripts/raw/item-images/dist/item-image-${
      imageId ?? 'placeholder'
    }.jpg`;
  }

  function getMapImageUrl(mapFile) {
    return `https://github.com/lukehorvat/el-userscripts/raw/map-images/dist/map-image-${
      mapFile ?? 'placeholder'
    }.jpg`;
  }

  function getMapImageCoords(mapFile, mapCoords) {
    const mapSize = mapSizes[mapFile];
    const left = (mapCoords.x / mapSize.width) * MAP_PREVIEW_SIZE;
    const bottom = (mapCoords.y / mapSize.height) * MAP_PREVIEW_SIZE;
    return { left, bottom };
  }

  function getMapFileFromName(mapName) {
    switch (mapName) {
      case 'IP':
      case 'IP(C1)':
      case 'Isla Prima':
        return 'startmap';
      case 'WS':
      case 'WS(C1)':
      case 'White Stone':
        return 'map2';
      case 'DP':
      case 'DP(C1)':
      case 'Desert Pines':
        return 'map3';
      case 'RoT':
      case 'RoT(C1)':
      case 'Ruins of Tirnym':
        return 'map4f';
      case 'VotD':
      case 'VotD(C1)':
      case 'Valley of the Dwarves':
        return 'map5nf';
      case 'PL':
      case 'PL(C1)':
      case 'Portland':
        return 'map6nf';
      case 'MM':
      case 'MM(C1)':
      case 'Morcraven Marsh':
        return 'map7';
      case 'Nara':
      case 'Nara(C1)':
      case 'Naralik':
        return 'map8';
      case 'GP':
      case 'GP(C1)':
      case 'Grubani Peninsula':
        return 'map9f';
      case 'TG':
      case 'TG(C1)':
      case 'Tarsengaard':
        return 'map11';
      case 'NC':
      case 'NC(C1)':
      case 'Nordcarn':
        return 'map12';
      case 'SKF':
      case 'SKF(C1)':
      case 'Southern Kilaran':
        return 'map13';
      case 'KF':
      case 'KF(C1)':
      case 'Kilaran Field':
        return 'map14f';
      case 'TD':
      case 'TD(C1)':
      case 'Tahraji Desert':
        return 'map15f';
      case 'CC':
      case 'CC(C1)':
      case 'Crystal Caverns':
        return 'cave1';
      case 'PA':
      case 'PA(C2)':
      case 'Port Anitora':
        return 'anitora';
      case 'Ida':
      case 'Ida(C2)':
      case 'Idaloran - City':
      case 'Idaloran':
        return 'cont2map1';
      case 'Bethel(C2)':
      case 'Bethel':
        return 'cont2map2';
      case 'Sedi':
      case 'Sedi(C2)':
      case 'Sedicolis':
        return 'cont2map3';
      case 'Melinis(C2)':
      case 'Melinis':
        return 'cont2map4';
      case 'PV':
      case 'PV(C2)':
      case 'Palon Vertas':
        return 'cont2map5';
      case 'Thelinor(C2)':
      case 'Thelinor':
        return 'cont2map6';
      case 'Irsis(C2)':
      case 'Irsis':
        return 'cont2map7';
      case 'EVTR':
      case 'EVTR(C2)':
      case 'Emerald Valley Trade Route':
        return 'cont2map8';
      case 'KJ':
      case 'KJ(C2)':
      case 'Kusamura Jungle':
        return 'cont2map9';
      case 'Zirak':
      case 'Zirak(C2)':
      case 'Zirakinbar':
        return 'cont2map10';
      case 'WF':
      case 'WVF':
      case 'WF(C2)':
      case 'WVF(C2)':
      case 'Willowvine Forest':
        return 'cont2map11';
      case 'AA':
      case 'AA(C2)':
      case 'Aeth Aelfan':
        return 'cont2map12';
      case 'EP':
      case 'EP(C2)':
      case 'Egratia Point':
        return 'cont2map13';
      case 'Arius(C2)':
      case 'Arius':
        return 'cont2map14';
      case 'NRM':
      case 'NRM(C2)':
      case 'North Redmoon':
        return 'cont2map15';
      case 'SRM':
      case 'SRM(C2)':
      case 'South Redmoon':
        return 'cont2map16';
      case 'SRM Mine':
      case 'SRM Mine(C2)':
      case 'South Redmoon - Mine':
        return 'cont2map16_insides';
      case 'Hurquin(C2)':
      case 'Hurquin':
        return 'cont2map17';
      case 'Trassian(C2)':
      case 'Trassian':
        return 'cont2map18';
      case 'Hulda':
        return 'cont2map19';
      case 'IotF':
      case 'IotF(C2)':
      case 'Isle of the Forgotten':
        return 'cont2map20';
      case 'II':
      case 'II(C2)':
      case 'Imbroglio Islands':
        return 'cont2map21';
      case 'Irin':
      case 'Irin(C2)':
      case 'Irinveron':
        return 'cont2map22';
      case 'Glac':
      case 'Glac(C2)':
      case 'Glacmor':
        return 'cont2map23';
      case 'Isca':
      case 'Isca(C2)':
      case 'Iscalrith':
        return 'cont2map24';
      default:
        return null;
    }
  }

  return {
    ITEM_THUMBNAIL_SIZE,
    MAP_THUMBNAIL_SIZE,
    MAP_PREVIEW_SIZE,
    getItemUrl,
    getItemWikiUrl,
    getItemImageUrl,
    getMapImageUrl,
    getMapImageCoords,
    getMapFileFromName,
  };
});
