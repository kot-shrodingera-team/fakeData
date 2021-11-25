function patchFonts($window, fakeProfile) {
  function defineobjectproperty(val, e, c, w) {
    // Makes an object describing a property
    return {
      value: val,
      enumerable: !!e,
      configurable: true,
      writable: true,
    };
  }

  const originalStyleSetProperty =
    $window.CSSStyleDeclaration.prototype.setProperty;
  const originalSetAttrib = $window.Element.prototype.setAttribute;
  const originalNodeAppendChild = $window.Node.prototype.appendChild;

  const DEFAULT = 'auto';

  // let fontListToUse = [ 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Comic Sans MS Bold', 'Comic Sans', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Caurier Regular', 'Ebrima', 'Fixedsys Regular', 'Franklin Gothic', 'Gabriola Regular', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets Regular', 'Impact Regular', 'Javanese Text Regular', 'Leelawadee UI', 'Lucida Console Regular', 'Lucida Sans Unicode Regular', 'Malgun Gothic', 'Microsoft Himalaya Regular', 'Microsoft JhengHei', 'Microsoft JhengHei UI', 'Microsoft PhangsPa', 'Microsoft Sans Serif Regular', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft YaHei UI', 'Microsoft Yi Baiti Regular', 'MingLiU_HKSCS-ExtB Regular', 'MingLiu-ExtB Regular', 'Modern Regular', 'Mongolia Baiti Regular', 'MS Gothic Regular', 'MS PGothic Regular', 'MS Sans Serif Regular', 'MS Serif Regular', 'MS UI Gothic Regular', 'MV Boli Regular', 'Myanmar Text', 'Nimarla UI', 'MV Boli Regular', 'Myanmar Tet', 'Nirmala UI', 'NSimSun Regular', 'Palatino Linotype', 'PMingLiU-ExtB Regular', 'Roman Regular', 'Script Regular', 'Segoe MDL2 Assets Regular', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Emoji Regular', 'Segoe UI Historic Regular', 'Segoe UI Symbol Regular', 'SimSun Regular', 'SimSun-ExtB Regular', 'Sitka Banner', 'Sitka Display', 'Sitka Heading', 'Sitka Small', 'Sitka Subheading', 'Sitka Text', 'Small Fonts Regular', 'Sylfaen Regular', 'Symbol Regular', 'System Bold', 'Tahoma', 'Terminal', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings Regular', 'Wingdings Regular', 'Yu Gothic', 'Yu Gothic UI',  'Calibri', 'Calibri Light', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier', 'Courier New', 'Ebrima', 'Fixedsys', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Javanese Text', 'Leelawadee UI', 'Leelawadee UI Semilight', 'Lucida Console', 'Lucida Sans Unicode', 'MS Gothic', 'MS PGothic', 'MS Sans Serif', 'MS Serif', 'MS UI Gothic', 'MV Boli', 'Malgun Gothic', 'Malgun Gothic Semilight', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft JhengHei Light', 'Microsoft JhengHei UI', 'Microsoft JhengHei UI Light', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft YaHei Light', 'Microsoft YaHei UI', 'Microsoft YaHei UI Light', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'MingLiU_HKSCS-ExtB', 'Modern', 'Mongolian Baiti', 'Myanmar Text', 'NSimSun', 'Nirmala UI', 'Nirmala UI Semilight', 'PMingLiU-ExtB', 'Palatino Linotype', 'Roman', 'Script', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Black', 'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Semilight', 'Segoe UI Symbol', 'SimSun', 'SimSun-ExtB', 'Sitka Banner', 'Sitka Display', 'Sitka Heading', 'Sitka Small', 'Sitka Subheading', 'Sitka Text', 'Small Fonts', 'Sylfaen', 'Symbol', 'System', 'Tahoma', 'Terminal', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic', 'Yu Gothic Light', 'Yu Gothic Medium', 'Yu Gothic UI', 'Yu Gothic UI Light', 'Yu Gothic UI Semibold', 'Yu Gothic UI Semilight'].map(function (x) { return x.toLowerCase() });
  // let fontListToUse =
  //    "AIGDT;AMGDT;AcadEref;Adobe Arabic;Adobe Caslon Pro;Adobe Caslon Pro Bold;Adobe Devanagari;Adobe Fan Heiti Std B;Adobe Fangsong Std R;Adobe Garamond Pro;Adobe Garamond Pro Bold;Adobe Gothic Std B;Adobe Hebrew;Adobe Heiti Std R;Adobe Kaiti Std R;Adobe Ming Std L;Adobe Myungjo Std M;Adobe Naskh Medium;Adobe Song Std L;Agency FB;Aharoni;Alexandra Script;Algerian;Amadeus;AmdtSymbols;AnastasiaScript;Andalus;Angsana New;AngsanaUPC;Annabelle;Aparajita;Arabic Transparent;Arabic Typesetting;Arial Baltic;Arial Black;Arial CE;Arial CYR;Arial Cyr;Arial Greek;Arial Narrow;Arial Rounded MT Bold;Arial TUR;Arial Unicode MS;Ariston;Arno Pro;Arno Pro Caption;Arno Pro Display;Arno Pro Light Display;Arno Pro SmText;Arno Pro Smbd;Arno Pro Smbd Caption;Arno Pro Smbd Display;Arno Pro Smbd SmText;Arno Pro Smbd Subhead;Arno Pro Subhead;BankGothic Lt BT;BankGothic Md BT;Baskerville Old Face;Batang;BatangChe;Bauhaus 93;Bell Gothic Std Black;Bell Gothic Std Light;Bell MT;Berlin Sans FB;Berlin Sans FB Demi;Bernard MT Condensed;Bickham Script One;Bickham Script Pro Regular;Bickham Script Pro Semibold;Bickham Script Two;Birch Std;Blackadder ITC;Blackoak Std;Bodoni MT;Bodoni MT Black;Bodoni MT Condensed;Bodoni MT Poster Compressed;Book Antiqua;Bookman Old Style;Bookshelf Symbol 7;Bradley Hand ITC;Britannic Bold;Broadway;Browallia New;BrowalliaUPC;Brush Script MT;Brush Script Std;Calibri;Calibri Light;Californian FB;Calisto MT;Calligraph;Cambria;Cambria Math;Candara;Carolina;Castellar;Centaur;Century;Century Gothic;Century Schoolbook;Ceremonious Two;Chaparral Pro;Chaparral Pro Light;Charlemagne Std;Chiller;CityBlueprint;Clarendon BT;Clarendon Blk BT;Clarendon Lt BT;Colonna MT;Comic Sans MS;CommercialPi BT;CommercialScript BT;Complex;Consolas;Constantia;Cooper Black;Cooper Std Black;Copperplate Gothic Bold;Copperplate Gothic Light;Copyist;Corbel;Cordia New;CordiaUPC;CountryBlueprint;Courier;Courier New;Courier New Baltic;Courier New CE;Courier New CYR;Courier New Cyr;Courier New Greek;Courier New TUR;Curlz MT;DFKai-SB;DaunPenh;David;Decor;DejaVu Sans;DejaVu Sans Condensed;DejaVu Sans Light;DejaVu Sans Mono;DejaVu Serif;DejaVu Serif Condensed;DilleniaUPC;DokChampa;Dotum;DotumChe;Dutch801 Rm BT;Dutch801 XBd BT;Ebrima;Eccentric Std;Edwardian Script ITC;Elephant;Engravers MT;Eras Bold ITC;Eras Demi ITC;Eras Light ITC;Eras Medium ITC;Estrangelo Edessa;EucrosiaUPC;Euphemia;EuroRoman;Eurostile;FangSong;Felix Titling;Fixedsys;Footlight MT Light;Forte;FrankRuehl;Franklin Gothic Book;Franklin Gothic Demi;Franklin Gothic Demi Cond;Franklin Gothic Heavy;Franklin Gothic Medium;Franklin Gothic Medium Cond;Freehand521 BT;FreesiaUPC;Freestyle Script;French Script MT;Futura Md BT;GDT;GENISO;Gabriola;Gadugi;Garamond;Garamond Premr Pro;Garamond Premr Pro Smbd;Gautami;Gentium Basic;Gentium Book Basic;Georgia;Giddyup Std;Gigi;Gill Sans MT;Gill Sans MT Condensed;Gill Sans MT Ext Condensed Bold;Gill Sans Ultra Bold;Gill Sans Ultra Bold Condensed;Gisha;Gloucester MT Extra Condensed;GothicE;GothicG;GothicI;Goudy Old Style;Goudy Stout;GreekC;GreekS;Gulim;GulimChe;Gungsuh;GungsuhChe;Haettenschweiler;Harlow Solid Italic;Harrington;Heather Script One;Helvetica;High Tower Text;Hobo Std;ISOCP;ISOCP2;ISOCP3;ISOCPEUR;ISOCT;ISOCT2;ISOCT3;ISOCTEUR;Impact;Imprint MT Shadow;Informal Roman;IrisUPC;Iskoola Pota;Italic;ItalicC;ItalicT;JasmineUPC;Jokerman;Juice ITC;KaiTi;Kalinga;Kartika;Khmer UI;KodchiangUPC;Kokila;Kozuka Gothic Pr6N B;Kozuka Gothic Pr6N EL;Kozuka Gothic Pr6N H;Kozuka Gothic Pr6N L;Kozuka Gothic Pr6N M;Kozuka Gothic Pr6N R;Kozuka Gothic Pro B;Kozuka Gothic Pro EL;Kozuka Gothic Pro H;Kozuka Gothic Pro L;Kozuka Gothic Pro M;Kozuka Gothic Pro R;Kozuka Mincho Pr6N B;Kozuka Mincho Pr6N EL;Kozuka Mincho Pr6N H;Kozuka Mincho Pr6N L;Kozuka Mincho Pr6N M;Kozuka Mincho Pr6N R;Kozuka Mincho Pro B;Kozuka Mincho Pro EL;Kozuka Mincho Pro H;Kozuka Mincho Pro L;Kozuka Mincho Pro M;Kozuka Mincho Pro R;Kristen ITC;Kunstler Script;Lao UI;Latha;Leelawadee;Letter Gothic Std;Levenim MT;Liberation Sans Narrow;LilyUPC;Lithos Pro Regular;Lucida Bright;Lucida Calligraphy;Lucida Console;Lucida Fax;Lucida Handwriting;Lucida Sans;Lucida Sans Typewriter;Lucida Sans Unicode;MS Gothic;MS Mincho;MS Outlook;MS PGothic;MS PMincho;MS Reference Sans Serif;MS Reference Specialty;MS Sans Serif;MS Serif;MS UI Gothic;MT Extra;MV Boli;Magneto;Maiandra GD;Malgun Gothic;Mangal;Marlett;Matura MT Script Capitals;Meiryo;Meiryo UI;Mesquite Std;Microsoft Himalaya;Microsoft JhengHei;Microsoft JhengHei UI;Microsoft New Tai Lue;Microsoft PhagsPa;Microsoft Sans Serif;Microsoft Tai Le;Microsoft Uighur;Microsoft YaHei;Microsoft YaHei UI;Microsoft Yi Baiti;MingLiU;MingLiU-ExtB;MingLiU_HKSCS;MingLiU_HKSCS-ExtB;Minion Pro;Minion Pro Cond;Minion Pro Med;Minion Pro SmBd;Miriam;Miriam Fixed;Mistral;Modern;Modern No. 20;Mongolian Baiti;Monospac821 BT;Monotxt;Monotype Corsiva;MoolBoran;Myriad Arabic;Myriad Hebrew;Myriad Pro;Myriad Pro Cond;Myriad Pro Light;Myriad Web Pro;NSimSun;Narkisim;Niagara Engraved;Niagara Solid;Nirmala UI;Nueva Std;Nueva Std Cond;Nyala;OCR A Extended;OCR A Std;OCR-A BT;OCR-B 10 BT;Old English Text MT;Onyx;OpenSymbol;Orator Std;Ouverture script;PMingLiU;PMingLiU-ExtB;Palace Script MT;Palatino Linotype;PanRoman;Papyrus;Parchment;Perpetua;Perpetua Titling MT;Plantagenet Cherokee;Playbill;Poor Richard;Poplar Std;Prestige Elite Std;Pristina;Proxy 1;Proxy 2;Proxy 3;Proxy 4;Proxy 5;Proxy 6;Proxy 7;Proxy 8;Proxy 9;Raavi;Rage Italic;Ravie;Rockwell;Rockwell Condensed;Rockwell Extra Bold;Rod;Roman;RomanC;RomanD;RomanS;RomanT;Romantic;Rosewood Std Regular;Sakkal Majalla;SansSerif;Script;Script MT Bold;ScriptC;ScriptS;Segoe Print;Segoe Script;Segoe UI;Segoe UI Light;Segoe UI Semibold;Segoe UI Semilight;Segoe UI Symbol;Shonar Bangla;Showcard Gothic;Shruti;SimHei;SimSun;SimSun-ExtB;Simplex;Simplified Arabic;Simplified Arabic Fixed;Small Fonts;Snap ITC;Square721 BT;Stencil;Stencil Std;Stylus BT;SuperFrench;Swis721 BT;Swis721 BdCnOul BT;Swis721 BdOul BT;Swis721 Blk BT;Swis721 BlkCn BT;Swis721 BlkEx BT;Swis721 BlkOul BT;Swis721 Cn BT;Swis721 Ex BT;Swis721 Hv BT;Swis721 Lt BT;Swis721 LtCn BT;Swis721 LtEx BT;Syastro;Sylfaen;Symap;Symath;Symbol;Symeteo;Symusic;System;Tahoma;TeamViewer8;Technic;TechnicBold;TechnicLite;Tekton Pro;Tekton Pro Cond;Tekton Pro Ext;Tempus Sans ITC;Terminal;Times New Roman;Times New Roman Baltic;Times New Roman CE;Times New Roman CYR;Times New Roman Cyr;Times New Roman Greek;Times New Roman TUR;Traditional Arabic;Trajan Pro;Trebuchet MS;Tunga;Tw Cen MT;Tw Cen MT Condensed;Tw Cen MT Condensed Extra Bold;Txt;UniversalMath1 BT;Utsaah;Vani;Verdana;Vijaya;Viner Hand ITC;Vineta BT;Vivaldi;Vladimir Script;Vrinda;WP Arabic Sihafa;WP ArabicScript Sihafa;WP CyrillicA;WP CyrillicB;WP Greek Century;WP Greek Courier;WP Greek Helve;WP Hebrew David;WP MultinationalA Courier;WP MultinationalA Helve;WP MultinationalA Roman;WP MultinationalB Courier;WP MultinationalB Helve;WP MultinationalB Roman;WST_Czec;WST_Engl;WST_Fren;WST_Germ;WST_Ital;WST_Span;WST_Swed;Webdings;Wide Latin;Wingdings;Wingdings 2;Wingdings 3;ZWAdobeF"
  //        .split(';').map(function (x) { return x.toLowerCase() });;

  const fontListToUse = fakeProfile.Fonts.map(function (x) {
    return x.toLowerCase();
  });

  const baseFonts = ['auto'];
  const keywords = ['inherit', 'auto'];
  baseFonts.push.apply(baseFonts, fontListToUse);
  baseFonts.push.apply(baseFonts, keywords);

  function getAllowedFontFamily(family) {
    const fonts = family.replace(/"|'/g, '').split(',');

    const allowedFonts = fonts.filter(function (font) {
      if (font && font.length) {
        const normalised = font.trim().toLowerCase();
        // Allow base fonts
        for (const allowed of baseFonts)
          if (normalised === allowed) return true;

        // Allow web fonts
        for (const allowed1 of document.fonts.values())
          if (normalised === allowed1) return true;
      }
      return false;
    });

    if (allowedFonts.length === 0) return undefined;
    return allowedFonts
      .map(function (f) {
        const trimmed = f.trim();
        return ~trimmed.indexOf(' ') ? `'${trimmed}'` : trimmed;
      })
      .join(', ');
  }

  function modifiedCssSetProperty(key, val) {
    if (key.toLowerCase() === 'font-family') {
      const allowed = getAllowedFontFamily(val);
      return originalStyleSetProperty.call(
        this,
        'font-family',
        allowed || DEFAULT
      );
    }
    return originalStyleSetProperty.call(this, key, val);
  }

  function makeModifiedSetCssText(originalSetCssText) {
    return function modifiedSetCssText(css) {
      const fontFamilyMatch = css.match(/\b(?:font-family:([^;]+)(?:;|$))/i);
      if (fontFamilyMatch && fontFamilyMatch.length == 1) {
        css = css.replace(/\b(font-family:[^;]+(;|$))/i, '').trim();
        const allowed = getAllowedFontFamily(fontFamilyMatch[1]) || DEFAULT;
        if (css.length && css[css.length - 1] !== ';') css += ';';
        css += `font-family: ${allowed};`;
      }
      return originalSetCssText.call(this, css);
    };
  }

  const modifiedSetAttribute = (function () {
    const innerModify = makeModifiedSetCssText(function (val) {
      return originalSetAttrib.call(this, 'style', val);
    });
    return function modifiedSetAttribute(key, val) {
      if (key.toLowerCase() === 'style') {
        return innerModify.call(this, val);
      }
      return originalSetAttrib.call(this, key, val);
    };
  })();

  function makeModifiedInnerHtml(originalInnerHtml) {
    return function modifiedInnerHtml(html) {
      // Add as normal, then fix before returning
      const retval = originalInnerHtml.call(this, html);
      recursivelyModifyFonts(this.parentNode);
      return retval;
    };
  }

  function recursivelyModifyFonts(elem) {
    if (elem) {
      if (elem.style && elem.style.fontFamily) {
        modifiedCssSetProperty.call(
          elem.style,
          'font-family',
          elem.style.fontFamily
        ); // Uses the special setter
      }
      if (elem.childNodes) elem.childNodes.forEach(recursivelyModifyFonts);
    }
    return elem;
  }

  function modifiedAppend(child) {
    try {
      child = recursivelyModifyFonts(child);
      return originalNodeAppendChild.call(this, child);
    } catch (e) {}
  }

  function overrideFunc(obj, name, f) {
    Object.defineProperty(obj.prototype, name, defineobjectproperty(f, true));
    obj.prototype[name].toString = function () {
      return `${name}() { [native code] }`;
    };
    obj.prototype[name].toString.toString = function () {
      return 'toString() { [native code] }';
    };
  }

  function overrideSetter(obj, name, makeSetter) {
    const current = Object.getOwnPropertyDescriptor(obj.prototype, name);
    current.set = makeSetter(current.set);
    current.configurable = true;
    Object.defineProperty(obj.prototype, name, current);
  }

  overrideFunc($window.Node, 'appendChild', modifiedAppend);
  overrideFunc(
    $window.CSSStyleDeclaration,
    'setProperty',
    modifiedCssSetProperty
  );
  overrideFunc($window.Element, 'setAttribute', modifiedSetAttribute);

  Object.defineProperty($window.CSSStyleDeclaration.prototype, 'fontFamily', {
    set: function fontFamily(f) {
      modifiedCssSetProperty.call(this, 'font-family', f);
    },
    get: function fontFamily() {
      return this.getPropertyValue('font-family');
    },
    configurable: true,
  });

  overrideSetter(
    $window.CSSStyleDeclaration,
    'cssText',
    makeModifiedSetCssText
  );
  overrideSetter($window.Element, 'innerHTML', makeModifiedInnerHtml);
  overrideSetter($window.Element, 'outerHTML', makeModifiedInnerHtml);
}

export default patchFonts;
