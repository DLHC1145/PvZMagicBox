// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ JSON РІ RTON
class JSON2RTON {
	// РЎС‚СЂРѕРєР° РІ С„РѕСЂРјР°С‚Рµ json
	_json = null;

	// РњР°СЃСЃРёРІ Р±Р°Р№С‚ РґР»СЏ РєРѕРЅРІРµСЂС‚Р°С†РёРё РІ RTON
	_rton = [];

	// РњР°СЃСЃРёРІ РєРµС€Р° СЃС‚СЂРѕРє
	_cache_str = [];

	// РњР°СЃСЃРёРІ РєРµС€Р° UTF 8 СЃС‚СЂРѕРє
	_cache_utf = [];

	// РњР°СЃСЃРёРІ РїСЂРµРѕР±СЂР°Р·РѕРІР°РЅРЅС‹Р№ РёР· JSON
	_array = [];

	// РЈСЃС‚Р°РЅР°РІР»РёРІР°РµРј JSON Рё РЅР°С‡Р°Р»СЊРЅС‹Рµ РґР°РЅРЅС‹Рµ
	set(json) {
		// РћР±РЅСѓР»СЏРµРј РґР°РЅРЅС‹Рµ
		this._json = JSON.parse(json);
		this._rton = [];
		this._cache_str = [];
		this._cache_utf = [];
		this._array = JSON.parse(json, (key, value, context) => {
			// Р•СЃР»Рё СЌС‚Рѕ С‡РёСЃР»Рѕ СЃ РґСЂРѕР±РЅРѕР№ С‡Р°СЃС‚СЊСЋ
			if (typeof value == "number" && context.source.indexOf(".") !== -1) {
				return {"__type__": "double", "__value__": context.source}
			// Р•СЃР»Рё С‡РёСЃР»Рѕ РЅРµ РІС…РѕРґРёС‚ РІ int32 Рё uint32
			} else if (typeof value == "number" && (-2147483648 > value || value > 4294967295)) {
				// Р•СЃР»Рё С‡РёСЃР»Рѕ РЅРµ РІС…РѕРґРёС‚ РІ int64 Рё uint64
				if (-9223372036854775808n > BigInt(context.source) || BigInt(context.source) > 18446744073709551615n)
					throw(`Key "${key}" contains the number "${context.source}" which is not included in int64 or uint64`);
				return {"__type__": "bigint", "__value__": context.source}
			// Р•СЃР»Рё РѕР±С‹С‡РЅРѕРµ С‡РёСЃР»Рѕ
			} else if (typeof value == "number") {
				return {"__type__": "int", "__value__": context.source}
			// Р•СЃР»Рё РґСЂСѓРіРѕРµ Р·РЅР°С‡РµРЅРёРµ
			} else {
				return value;
			}
		});

		return true;
	}

	// Р’РѕР·РІСЂР°С‰Р°РµРј RTON СЃС‚СЂРѕРєСѓ
	get(type = "array") {
		// Р”РѕР±Р°РІР»СЏРµРј РїРµСЂРІС‹Рµ СЌР»РµРјРµРЅС‚С‹ RTON1000
		this._rton.push(0x52, 0x54, 0x4f, 0x4e, 0x01, 0x00, 0x00, 0x00);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ RTON
		this._toObject(this._array, true);
		
		// Р”РѕР±Р°РІР»СЏРµРј РїРѕСЃР»РµРґРЅРёРµ DONE
		this._rton.push(0x44, 0x4f, 0x4e, 0x45);

		// Р•СЃР»Рё РЅСѓР¶РµРЅ СЂРµР·СѓР»СЊС‚Р°С‚ РІ РІРёРґРµ РјР°СЃСЃРёРІР° Р±Р°Р№С‚
		if (type == "array") {
			return this._rton;
		// РІ РІРёРґРµ РґРІРѕРёС‡РЅС‹С… РґР°РЅРЅС‹С…
		} else if (type == "binary") {
			const binary = new Uint8Array(this._rton);
			return new Blob([binary], {type: "application/octet-stream"});
		// РІ РІРёРґРµ СѓРґРѕР±РЅРѕР№ HEX СЃС‚СЂРѕРєРё
		} else if (type == "hex") {
			let res = "";
			for (let i = 0; i < this._rton.length; i += 2) {
				if (i != 0 && i % 16 == 0)
					res += "\n";
				res += this._rton[i].toString(16).padStart(2, '0');
				res += (this._rton[i + 1] != undefined) ? this._rton[i + 1]?.toString(16).padStart(2, '0') + " " : "";
			}
			return res;
		// Р•СЃР»Рё СѓРєР°Р·Р°РЅ РЅРµ РІРµСЂРЅРѕРµ РїСЂРµРґСЃС‚Р°РІР»РµРЅРёРµ
		} else {
			throw(`The representation "${type}" does not match`);
		}
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ СЃРїРёСЃРєР° РІ RTON
	_parse(item) {
		// РџРѕР»СѓС‡Р°РµРј С‚РёРї
		let type = typeof item;
		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё РѕС‚ С‚РёРїР°
		if (Array.isArray(item) && item.length === 0) {// Р•СЃР»Рё СЌС‚Рѕ РїСѓСЃС‚РѕР№ РјР°СЃСЃРёРІ
			this._rton.push(0x86, 0xfd, 0x00, 0xfe);
		} else if (Array.isArray(item)) {// Р•СЃР»Рё СЌС‚Рѕ РјР°СЃСЃРёРІ
			this._toArray(item);
		} else if (type === "object" && item.__type__ == "double") { // double
			this._toDouble(item.__value__);
		} else if (type === "object" && item.__type__ == "bigint") { // bigint
			this._toBigInt(item.__value__);
		} else if (type === "object" && item.__type__ == "int") { // int
			this._toInt(item.__value__);
		} else if (type === "object") { // Р•СЃР»Рё СЌС‚Рѕ РѕР±СЉРµРєС‚
			this._toObject(item);
		} else if (type === "boolean" && item === false) { // false
			this._rton.push(0x00);
		} else if (type == 'boolean' && item === true) { // true
			this._rton.push(0x01);
		} else if (type === "string" && item === '""') { // empty string
			this._rton.push(0x81, 0x00);
		} else if (type === "string" && item === '"RTID(0)"') { // empty rtid
			this._rton.push(0x84);
		} else if (type === "string" && item === '"RTID()"') { // null rtid
			this._rton.push(0x83, 0x00);
		} else if (type === "string" && /RTID\(.{1,2}\..{1,2}\..{8}@.*?\)/i.test(item)) { // rtid ID
			this._toRtidID(item);
		} else if (type === "string" && /^RTID\(.*@.*\)$/i.test(item)) { // rtid
			this._toRtid(item);
		} else if (type === "string") { // string
			this._toSting(item);
		} else { // Р§С‚Рѕ-С‚Рѕ РЅРµ РЅР°Р№РґРµРЅРЅРѕРµ
			throw(`Unrecognized type: "${type}" with value "${item}"`);
		}

	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ СЃРїРёСЃРєР° РІ РѕР±СЉРµРєС‚
	_toObject(item, root = false) {
		// РќР°С‡Р°Р»Рѕ РѕР±СЉРµРєС‚Р° РµСЃР»Рё РѕРЅ РЅРµ РєРѕСЂРЅРµРІРѕР№
		if ( ! root)
			this._rton.push(0x85);

		// РџСЂРѕС…РѕРґРёРјСЃСЏ РїРѕ РєР»СЋС‡Р°Рј Рё Р·РЅР°С‡РµРЅРёСЏРј РѕР±СЉРµРєС‚Р°
		for (let i in item) {
			// Р”РѕР±Р°РІР»СЏРµРј РєР»СЋС‡
			this._toSting(i);

			// Р”РѕР±Р°РІР»СЏРµРј Р·РЅР°С‡РµРЅРёРµ
			this._parse(item[i]);
		}

		// РљРѕРЅРµС† РѕР±СЉРµРєС‚Р° РµСЃР»Рё РѕРЅ РЅРµ РєРѕСЂРЅРµРІРѕР№
		this._rton.push(0xff);
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ СЃРїРёСЃРєР° РІ РјР°СЃСЃРёРІ
	_toArray(item) {
		// РќР°С‡Р°Р»Рѕ РјР°СЃСЃРёРІР°
		this._rton.push(0x86, 0xfd);
		// РљРѕР»РёС‡РµСЃС‚РІРѕ СЌР»РµРјРµРЅС‚РѕРІ
		this._toNum(item.length);
		// РџСЂРѕС…РѕРґРёРјСЃСЏ РјР°СЃСЃРёРІСѓ
		for (let i of item) {
			// Р”РѕР±Р°РІР»СЏРµРј Р·РЅР°С‡РµРЅРёРµ
			this._parse(i);
		}

		// РљРѕРЅРµС† РјР°СЃСЃРёРІР°
		this._rton.push(0xfe);
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ СЃС‚СЂРѕРєРё РІ RTON
	_toSting(str) {
		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ 8 Р±РёС‚РѕРІС‹Р№ РјР°СЃСЃРёРІ
		let strUTF = new TextEncoder().encode(str);

		// Р•СЃР»Рё СЌС‚Рѕ РѕР±С‹С‡РЅР°СЏ СЃС‚СЂРѕРєР°
		if (str.length == strUTF.length) {
			let pos = this._cache_str.indexOf(str);
			// Р•СЃР»Рё СЃС‚СЂРѕРєР° РµСЃС‚СЊ РІ РєРµС€Рµ
			if (pos !== -1) {
				this._rton.push(0x91);
				this._toNum(pos);
			} else {
				// Р”РѕР±Р°РІР»СЏРµРј СЃСЂРѕРєСѓ РІ РєСЌС€
				this._cache_str.push(str);
				this._rton.push(0x90);
				this._toNum(str.length);
				for (let i = 0; i < str.length; i++)
					this._rton.push(str.charCodeAt(i));
			}
		// Р•СЃР»Рё СЌС‚Рѕ UTF 8 СЃС‚СЂРѕРєР°
		} else {
			let pos = this._cache_utf.indexOf(str);
			// Р•СЃР»Рё СЃС‚СЂРѕРєР° РµСЃС‚СЊ РІ РєРµС€Рµ
			if (pos !== -1) {
				this._rton.push(0x93);
				this._toNum(pos);
			} else {
				// Р”РѕР±Р°РІР»СЏРµРј СЃСЂРѕРєСѓ РІ РєСЌС€
				this._cache_utf.push(str);
				this._rton.push(0x92);
				this._toNum(str.length);
				this._toNum(strUTF.length);
				for (let i = 0; i < strUTF.length; i++)
					this._rton.push(strUTF[i]);
			}
		}
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ РЅРѕРјРµСЂР° РІ RTON
	_toNum(num) {
		// Р•СЃР»Рё СЌС‚Рѕ РЅРѕР»СЊ
		if ( ! num) {
			this._rton.push(0x00);
			return;
		}
		// Р Р°Р·Р±РёРІР°РµРј С‡РёСЃР»Рѕ РЅР° Р±Р°Р№С‚С‹
		while (num) {
			let temp = num % 0x100;
			num = parseInt(num / 0x100) * 2;
			if (temp > 0x7f) {
				num++;
			} else if (num > 0) {
				temp += 0x80;
			}
			this._rton.push(temp);
		}
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ RTID ID РІ RTON (83 02 [L1] [L2] [string] [U2] [U1] [4-byte ID])
	_toRtidID(rtid) {
		// РќР°С‡Р°Р»Рѕ RTID
		this._rton.push(0x83, 0x02);
		// Р Р°Р·Р±РёСЂР°РµРј RTID
		const matches = rtid.match(/RTID\((.{1,2})\.(.{1,2})\.(.{8})@(.*?)\)/i);

		// Р”РѕР±Р°РІР»СЏРµРј РїРµСЂРІСѓСЋ С‡Р°СЃС‚СЊ
		this._toNum(matches[4].length);
		this._toNum(matches[4].length);
		for (let i = 0; i < matches[4].length; i++)
			this._rton.push(matches[4].charCodeAt(i));

		// Р”РѕР±Р°РІР»СЏРµРј U2
		this._rton.push(Number("0x" + matches[2]));
		if (Number("0x" + matches[2]) > 127)
			this._rton.push(1);

		// Р”РѕР±Р°РІР»СЏРµРј U1
		this._rton.push(Number("0x" + matches[1]));
		if (Number("0x" + matches[1]) > 127)
			this._rton.push(1);

		// Р”РѕР±Р°РІР»СЏРµРј ID
		for (let i = 8; i > 0; i -= 2) 
			this._rton.push(Number("0x" + matches[3].slice(i - 2, i)));
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ RTID РІ RTON (83 03 [L1] [L2] [string] [L3] [L4] [string 2])
	_toRtid(rtid) {
		// РќР°С‡Р°Р»Рѕ RTID
		this._rton.push(0x83, 0x03);
		// Р Р°Р·Р±РёСЂР°РµРј RTID
		const matches = rtid.match(/^RTID\((.*)@(.*)\)$/i);

		// Р”РѕР±Р°РІР»СЏРµРј РїРµСЂРІСѓСЋ С‡Р°СЃС‚СЊ
		this._toNum(matches[2].length);
		this._toNum(matches[2].length);
		for (let i = 0; i < matches[2].length; i++)
			this._rton.push(matches[2].charCodeAt(i));

		// Р”РѕР±Р°РІР»СЏРµРј РІС‚РѕСЂСѓСЋ С‡Р°СЃС‚СЊ
		this._toNum(matches[1].length);
		this._toNum(matches[1].length);
		for (let i = 0; i < matches[1].length; i++)
			this._rton.push(matches[1].charCodeAt(i));
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ С‡РёСЃР»Р° РІ RTON
	_toInt(num) {
		num = parseInt(num);
		let depth = false;
		if (num === 0) { // 0
			this._rton.push(0x9);
			return;
		} else if (num >= -128 && num <= 127) { // int8
			this._rton.push(0x8);
			depth = 1;
		} else if (num >= 128 && num <= 255) { // uint8
			this._rton.push(0xa);
			depth = 1;
		} else if (num >= -32768 && num <= 32767) { // int16
			this._rton.push(0x10);
			depth = 2;
		} else if (num >= 32768 && num <= 65535) { // uint16
			this._rton.push(0x12);
			depth = 2;
		} else if (num >= -2147483648 && num <= 2147483647) { // int32
			this._rton.push(0x20);
			depth = 4;
		} else if (num >= 2147483648 && num <= 4294967295) { // uint32
			this._rton.push(0x26);
			depth = 4;
		} else { // Р§С‚Рѕ С‚Рѕ РѕС‡РµРЅСЊ Р±РѕР»СЊС€РѕРµ РёР»Рё РѕС‡РµРЅСЊ РјР°Р»РµРЅСЊРєРѕРµ
			throw(`Type is "int", but value is outside the 32-bit range: "${item}"`);
		}

		// Р—Р°РїРѕР»РЅСЏРµРј РґР°РЅРЅС‹РјРё
		for (let i = 0; i < depth; i++) {
			let byte = num & 0xff;
			this._rton.push(byte);
			num = (num - byte) / 256;
		}
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р±РѕР»СЊС€РѕРіРѕ С‡РёСЃР»Р° РІ RTON
	_toBigInt(num) {
		// Р•СЃР»Рё С‡РёСЃР»Рѕ РІР»РµР·Р°РµС‚ РІ int64 РёРЅР°С‡Рµ uint64
		this._rton.push((BigInt(num) >= -9223372036854775808n && BigInt(num) <= 9223372036854775807n) ? 0x40 : 0x46);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ Р±СѓС„РµСЂ
		const buffer = new ArrayBuffer(8);
		const view = new DataView(buffer);
		view.setBigInt64(0, num, true); 
		const uint8Array = new Uint8Array(buffer);

		// Р—Р°РЅРѕСЃРёРј РІ РѕР±С‰РёР№ РјР°СЃСЃРёРІ
		for (let i = 0; i < uint8Array.length; i++)
			this._rton.push(uint8Array[i]);
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ С‡РёСЃР»Р° СЃ РїР»Р°РІР°СЋС‰РµР№ Р·Р°РїСЏС‚РѕР№ РІ RTON									
	_toDouble(num) {
		if (num === "0.0") {
			this._rton.push(0x43);
		} else {
			this._rton.push(0x42);
			// РџСЂРµРѕР±СЂР°Р·РѕРІС‹РІР°РµРј РІ Р±СѓС„РµСЂ
			let float = new Uint8Array(new Float64Array([parseFloat(num)]).buffer);
			for (let i = 0; i < float.length; i++)
				this._rton.push(float[i]);
		}
	}
}