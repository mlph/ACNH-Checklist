import { ItemJ } from 'src/app/services/data.service';
import { BaseComponent } from '../base.component';

const f: BaseComponent<ItemJ>['filter_detail'] = [
  // {key:"sourceSheet", Category;
  { key: 'name', value: '', valueType: 'string' },
  { key: 'image', value: '', valueType: 'string' },
  { key: 'variation', value: null, valueType: 'never' },
  { key: 'bodyTitle', value: '', valueType: 'string' },
  { key: 'pattern', value: null, valueType: 'never' },
  { key: 'patternTitle', value: null, valueType: 'never' },
  { key: 'diy', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'bodyCustomize', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'patternCustomize', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'kitCost', value: 0, valueType: 'number' },
  { key: 'kitType', value: null, valueType: 'never' },
  { key: 'buy', value: 0, valueType: 'number' },
  { key: 'sell', value: 0, valueType: 'number' },
  // {key:"size", Size | undefined;
  { key: 'surface', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'exchangePrice', value: 0, valueType: 'number' },
  // {key:"exchangeCurrency", ExchangeCurrency | null | undefined;
  // {key:"source", value:"", valueType:"string"},[] | undefined;
  // {key:"sourceNotes", value:"", valueType:"string"},[] | null | undefined;
  { key: 'seasonEvent', value: '', valueType: 'string' },
  { key: 'seasonEventExclusive', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'hhaBasePoints', value: 0, valueType: 'number' },
  // {key:"hhaCategory", HhaCategory | null | undefined;
  // {key:"interact", ,value:false, valueType:"boolean", fuzzy:true}, | InteractEnum | undefined;
  { key: 'tag', value: '', valueType: 'string' },
  { key: 'outdoor', value: false, valueType: 'boolean', fuzzy: true },
  // {key:"speakerType", SpeakerType | null | undefined;
  // {key:"lightingType", LightingType | null | undefined;
  // {key:"catalog", Catalog | null | undefined;
  // {key:"versionAdded", Version | undefined;
  { key: 'unlocked', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'filename', value: '', valueType: 'string' },
  // {key:"variantId", VariantID | null | undefined;
  { key: 'internalId', value: 0, valueType: 'number' },
  { key: 'uniqueEntryId', value: '', valueType: 'string' },
  // {key:"translations", SeriesTranslations | null;
  // {key:"colors", Color[] | undefined;
  // {key:"concepts", Concept[] | undefined;
  { key: 'set', value: '', valueType: 'string' },
  { key: 'series', value: '', valueType: 'string' },
  // {key:"recipe", Recipe | null;
  // {key:"themesTranslations", ThemesTranslations | undefined;
  // {key:"variations", VariationElement[] | undefined;
  // {key:"styles", Style[] | undefined;
  // {key:"themes", Theme[] | undefined;
  { key: 'customize', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'framedImage', value: '', valueType: 'string' },
  { key: 'albumImage', value: '', valueType: 'string' },
  { key: 'inventoryImage', value: '', valueType: 'string' },
  { key: 'stackSize', value: 0, valueType: 'number' },
  { key: 'inventoryFilename', value: '', valueType: 'string' },
  { key: 'storageImage', value: '', valueType: 'string' },
  { key: 'storageFilename', value: '', valueType: 'string' },
  // {key:"seriesTranslations", SeriesTranslations | undefined;
  // {key:"sizeCategory", SizeCategory | undefined;
  // {key:"primaryShape", PrimaryShape | undefined;
  // {key:"secondaryShape", SecondaryShape | null | undefined;
  { key: 'vfx', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'doorDeco', value: false, valueType: 'boolean', fuzzy: true },
  // {key:"vfxType", VfxType | null | undefined;
  // {key:"paneType", PaneType | null | undefined;
  { key: 'uses', value: 0, valueType: 'number' },
  { key: 'highResTexture', value: null, valueType: 'never' },
  // {key:"category", Category | undefined;

  //#region common

  //#endregion

  //#region cloth
  { key: 'villagerEquippable', value: false, valueType: 'boolean', fuzzy: true },
  // {key:"seasonalAvailability", SeasonalAvailability | undefined;
  { key: 'type', value: '', valueType: 'string' },
  { key: 'closetImage', value: '', valueType: 'string' },
  // {key:"seasonality", SeasonalAvailability | undefined;
  // {key:"mannequinSeason", SeasonalAvailability | null | undefined;
  // {key:"gender", Gender | undefined;
  // {key:"villagerGender", Gender | null | undefined;
  { key: 'sortOrder', value: 0, valueType: 'number' },
  { key: 'clothGroupId', value: 0, valueType: 'number' },
  //#endregion

  //#region wallpaper
  // {key:"curtainType", CurtainType | null | undefined;
  { key: 'curtainColor', value: '', valueType: 'string' },
  // {key:"ceilingType", CeilingType | undefined;
  // {key:"windowType", WindowType | null | undefined;
  // {key:"windowColor", WindowColor | null | undefined;
  //#endregion

  //#region museum
  { key: 'realArtworkTitle', value: '', valueType: 'string' },
  { key: 'artist', value: '', valueType: 'string' },
  { key: 'genuine', value: false, valueType: 'boolean', fuzzy: true },
  { key: 'fossilGroup', value: '', valueType: 'string' },
  // {key:"description", value:"", valueType:"string"},[] | undefined;
  // {key:"museum", Museum | undefined;
  //#endregion

  //#region message card
  { key: 'startDate', value: '', valueType: 'string' },
  { key: 'endDate', value: '', valueType: 'string' },
  { key: 'backColor', value: '', valueType: 'string' },
  { key: 'bodyColor', value: '', valueType: 'string' },
  { key: 'headColor', value: '', valueType: 'string' },
  { key: 'footColor', value: '', valueType: 'string' },
  { key: 'penColor1', value: '', valueType: 'string' },
  { key: 'penColor2', value: '', valueType: 'string' },
  { key: 'penColor3', value: '', valueType: 'string' },
  { key: 'penColor4', value: '', valueType: 'string' },
  { key: 'nhStartDate', value: '', valueType: 'string' },
  { key: 'nhEndDate', value: '', valueType: 'string' },
  { key: 'shStartDate', value: '', valueType: 'string' },
  { key: 'shEndDate', value: '', valueType: 'string' },
  //#endregion
];
