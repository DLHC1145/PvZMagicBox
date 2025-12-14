// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ RTON РІ JSON
class RTON2JSON {
	// РЎС‚СЂРѕРєР° РІ С„РѕСЂРјР°С‚Рµ RTON
	_rton = null;

	// РњР°СЃСЃРёРІ РєРµС€Р° СЃС‚СЂРѕРє
	_cache_str = [];

	// РњР°СЃСЃРёРІ РєРµС€Р° UTF 8 СЃС‚СЂРѕРє
	_cache_utf = [];

	// РўРµРєСѓС‰РёР№ РёРЅРґРµРєСЃ
	_index = 8;

	// Р РµР·СѓР»СЊС‚Р°С‚
	_result = '';

	// РљРѕР»РёС‡РµСЃС‚РІРѕ РѕС‚СЃС‚СѓРїРѕРІ
	_format = 0;

	// РЈСЃС‚Р°РЅР°РІР»РёРІР°РµРј RTON Рё РЅР°С‡Р°Р»СЊРЅС‹Рµ РґР°РЅРЅС‹Рµ
	set(rton) {
		// РџСЂРѕРІРµСЂСЏРµРј РЅР°С‡Р°Р»Рѕ Рё РєРѕРЅРµС† С„Р°Р№Р»Р° rton (RTON Рё DONE)
		if (rton.slice(0, 4).toString() !== [82, 84, 79, 78].toString() || rton.slice(-4).toString() !== [68, 79, 78, 69].toString())
			throw(`The file is not RTON`);

		// РЈСЃС‚Р°РЅР°РІР»РёРІР°РµРј RTON СЃС‚СЂРѕРєСѓ
		this._rton = rton;

		// РћР±РЅСѓР»СЏРµРј РїСЂРµРґС‹РґСѓС‰РёРµ СЂРµР·СѓР»СЊС‚Р°С‚С‹
		this._cache_str = [];
		this._cache_utf = [];
		this._index = 8;
		this._result = '';
		this._format = 0;

		return true;
	}

	// Р’РѕР·РІСЂР°С‰Р°РµРј JSON
	get() {
		// Р’С‹РїРѕР»РЅСЏРµРј РїСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ
		this._toObject();

		return `{\n${this._result}\n}`;
	}

	// Р’ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё РѕС‚ С‚РёРїР° РІС‹РїРѕР»РЅСЏРµРј РїСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ
	_type() {
		// РџРѕР»СѓС‡Р°РµРј С‚РёРї РґР°РЅРЅС‹С…
		let type = this._rton[this._index++];

		switch (type) {
			case 0x00: // false
				this._result += 'false';
				break;
			case 0x01: // true
				this._result += 'true';
				break;
			case 0x08: // int8
				this._result += this._toInt(1);
				break;
			case 0x09: // 0 РІ int8
				this._result += 0;
				break;
			case 0x0a: // uint8
				this._result += this._toUint(1);
				break;
			case 0x0b: // 0 РІ uint8
				this._result += 0;
				break;
			case 0x10: // int16
				this._result += this._toInt(2);
				break;
			case 0x11: // 0 РІ int16
				this._result += 0;
				break;
			case 0x12: // uint16
				this._result += this._toUint(2);
				break;
			case 0x13: // 0 РІ uint16
				this._result += 0;
				break;
			case 0x20: // int32
				this._result += this._toInt(4);
				break;
			case 0x21: // 0 РІ int32
				this._result += 0;
				break;
			case 0x22: // float
				this._result += this._toFloat();
				break;
			case 0x23: // 0 РІ float
				this._result += '0.0';
				break;
			case 0x24: // Р±РµР·Р·РЅР°РєРѕРІРѕРµ С‡РёСЃР»Рѕ RTON
			case 0x28:
			case 0x44:
			case 0x48:
				this._result += this._toUnum();
				break;
			case 0x25: // Р·РЅР°РєРѕРІРѕРµ С‡РёСЃР»Рѕ RTON
			case 0x29:
			case 0x45:
			case 0x49:
				this._result += this._toNum();
				break;
			case 0x26: // uint32
				this._result += this._toUint(4);
				break;
			case 0x27: // 0 РІ uint32
				this._result += 0;
				break;
			case 0x40: // int64
				this._result += this._toInt(8);
				break;
			case 0x41: // 0 РІ int64
				this._result += 0;
				break;
			case 0x42: // double
				this._result += this._toDouble();
				break;
			case 0x43: // 0 РІ double
				this._result += '0.0';
				break;
			case 0x46: // uint64
				this._result += this._toUint64();
				break;
			case 0x47: // 0 РІ uint64
				this._result += 0;
				break;
			case 0x81: // СЃС‚СЂРѕРєР°
				this._result += '"' + this._toStr() + '"';
				break;
			case 0x82: // utf8 СЃС‚СЂРѕРєР°
				this._result += '"' + this._toUtf() + '"';
				break;
			case 0x83: // rtid
				this._result += '"' + this._toRtid() + '"';
				break;
			case 0x84: // rtid РїСѓСЃС‚РѕР№
				this._result += '"RTID(0)"';
				break;
			case 0x85: // РѕР±СЉРµРєС‚
				this._result += "{\n";

				this._toObject();

				// Р¤РѕСЂРјР°С‚РёСЂСѓРµРј СЃС‚СЂРѕРєСѓ
				this._result += "\n";
				for (let t = 0; t < this._format; t++)
					this._result += "\t";

				this._result += "}";
				break;
			case 0x86: // РјР°СЃСЃРёРІ
				this._result += "[\n";

				this._toArray();

				// Р¤РѕСЂРјР°С‚РёСЂСѓРµРј СЃС‚СЂРѕРєСѓ
				this._result += "\n";
				for (let t = 0; t < this._format; t++)
					this._result += "\t";

				this._result += "]";
				break;
			case 0x90: // СЃС‚СЂРѕРєР° СЃ РєСЌС€РµРј
				this._result += '"' + this._toStr(true) + '"';
				break;
			case 0x91: // СЃС‚СЂРѕРєР° РёР· РєСЌС€Р°
				this._result += '"' + this._toStrUncache() + '"';
				break;
			case 0x92: // UTF 8 СЃС‚СЂРѕРєР° СЃ РєСЌС€РµРј
				this._result += '"' + this._toUtf(true) + '"';
				break;
			case 0x93: // UTF 8 СЃС‚СЂРѕРєР° РёР· РєСЌС€Р°
				this._result += '"' + this._toUtfUncache() + '"';
				break;
			default: // С‡С‚Рѕ-С‚Рѕ РЅРµ РїСЂРµРґСѓСЃРјРѕС‚СЂРµРЅРЅРѕРµ
				throw(`Type ${type} not found in ${this._index}`);
		}
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ СЃС‚СЂРѕРєРё
	_toStr(cache = false) {
		// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё РґР»РёРЅСѓ СЃС‚СЂРѕРєРё
		let len = this._len(this._rton.slice(this._index, this._index + 8));
		let length = this._int(this._rton.slice(this._index, this._index + len));

		// РџРѕР»СѓС‡Р°РµРј Р±Р°Р№С‚С‹
		let bytes = this._rton.slice(this._index + len, this._index + length + len);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ СЃС‚СЂРѕРєСѓ
		let str = new TextDecoder().decode(bytes);
		str = this._clearStr(str);

		// Р”РѕР±Р°РІР»СЏРµРј СЃС‚СЂРѕРєСѓ РІ РєСЌС€ РµСЃР»Рё РєСЌС€РёСЂСѓРµРјР°СЏ СЃС‚СЂРѕРєР°
		if (cache)
			this._cache_str.push(str);

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len + length;

		return str;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ РєСЌС€Р° СЃС‚СЂРѕРєРё
	_toStrUncache() {
		// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё РґР»РёРЅСѓ СЃС‚СЂРѕРєРё
		let len = this._len(this._rton.slice(this._index, this._index + 8));
		let number = this._int(this._rton.slice(this._index, this._index + len));

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len;

		// Р’С‹Р±РёСЂР°РµРј СЃС‚СЂРѕРєСѓ РёР· РєСЌС€Р°
		return this._cache_str[number];
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ UTF СЃС‚СЂРѕРєРё
	_toUtf(cache = false) {
		// РћР±СЂРµР·Р°РµРј РёР·Р±С‹С‚РѕС‡РЅС‹Рµ РґР°РЅРЅС‹Рµ
		let len = this._len(this._rton.slice(this._index, this._index + 8));

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len;

		// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё РґР»РёРЅСѓ СЃС‚СЂРѕРєРё
		len = this._len(this._rton.slice(this._index, this._index + 8));
		let length = this._int(this._rton.slice(this._index, this._index + len));

		// РџРѕР»СѓС‡Р°РµРј Р±Р°Р№С‚С‹
		let bytes = this._rton.slice(this._index + len, this._index + length + len);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ СЃС‚СЂРѕРєСѓ
		let str = new TextDecoder().decode(bytes);
		str = this._clearStr(str);

		// Р”РѕР±Р°РІР»СЏРµРј СЃС‚СЂРѕРєСѓ РІ РєСЌС€ РµСЃР»Рё РєСЌС€РёСЂСѓРµРјР°СЏ СЃС‚СЂРѕРєР°
		if (cache)
			this._cache_utf.push[str];

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len + length;

		return str;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ РєСЌС€Р° UTF СЃС‚СЂРѕРєРё
	_toUtfUncache() {
		// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё РґР»РёРЅСѓ СЃС‚СЂРѕРєРё
		let len = this._len(this._rton.slice(this._index, this._index + 8));
		let number = this._int(this._rton.slice(this._index, this._index + len));

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len;

		// Р’С‹Р±РёСЂР°РµРј СЃС‚СЂРѕРєСѓ РёР· РєСЌС€Р°
		return this._cache_utf[number];
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ РІ RTID
	_toRtid() {
		let type = this._rton[this._index++];

		if (type === 0x02) {
			// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё РґР»РёРЅСѓ СЃС‚СЂРѕРєРё
			let len = this._len(this._rton.slice(this._index, this._index + 8));
			let length = this._int(this._rton.slice(this._index, this._index + len));

			// РџРѕР»СѓС‡Р°РµРј СЃС‚СЂРѕРєСѓ
			let str1 = this._rton.slice(this._index + len + len, this._index + len + len + length);
			str1 = new TextDecoder().decode(str1);

			// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
			this._index += len + len + length;

			// РџРѕР»СѓС‡Р°РµРј РїРµСЂРІСѓСЋ С‡Р°СЃС‚СЊ ID
			let u1 = parseInt(this._rton.slice(this._index, this._index + 1));
			this._index += (u1 > 127) ? 2 : 1;

			// РџРѕР»СѓС‡Р°РµРј РІС‚РѕСЂСѓСЋ С‡Р°СЃС‚СЊ ID
			let u2 = parseInt(this._rton.slice(this._index, this._index + 1));
			this._index += (u2 > 127) ? 2 : 1;

			// РџРѕР»СѓС‡Р°РµРј ID
			let uid = "";
			this._rton.slice(this._index, this._index + 4).map((el) => {
				uid = el.toString(16).padStart(2, "0") + uid;
			});

			// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
			this._index += 4;

			return `RTID(${u2.toString(16)}.${u1.toString(16)}.${uid}@${str1})`;

		} else if (type === 0x03) {
			// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё РґР»РёРЅСѓ СЃС‚СЂРѕРєРё
			let len = this._len(this._rton.slice(this._index, this._index + 8));
			let length = this._int(this._rton.slice(this._index, this._index + len));

			// РџРѕР»СѓС‡Р°РµРј СЃС‚СЂРѕРєСѓ
			let str1 = this._rton.slice(this._index + len + len, this._index + len + len + length);
			str1 = new TextDecoder().decode(str1);

			// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
			this._index += len + len + length;

			// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё РґР»РёРЅСѓ СЃС‚СЂРѕРєРё
			len = this._len(this._rton.slice(this._index, this._index + 8));
			length = this._int(this._rton.slice(this._index, this._index + len));

			// РџРѕР»СѓС‡Р°РµРј СЃС‚СЂРѕРєСѓ
			let str2 = this._rton.slice(this._index + len + len, this._index + len + len + length);
			str2 = new TextDecoder().decode(str2);

			// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
			this._index += len + len + length;

			return `RTID(${str2}@${str1})`;
		} else {
			throw(`RTID ${type} - not found in ${this._index}`);
		}
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р·РЅР°РєРѕРІРѕРіРѕ С‡РёСЃР»Р°
	_toInt(len) {
		// РџРѕР»СѓС‡Р°РµРј СЃС‚СЂРѕРєСѓ
		let str = this._rton.slice(this._index, this._index + len);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ С‡РёСЃР»Рѕ
		let int = 0;
		for (var i = str.length - 1; i >= 0; i--) {
			int = (int * 256) + str[i];
		}

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len;

		return int;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р±РµР·Р·РЅР°РєРѕРІРѕРіРѕ С‡РёСЃР»Р°
	_toUint(len) {
		// РџРѕР»СѓС‡Р°РµРј СЃС‚СЂРѕРєСѓ
		let str = this._rton.slice(this._index, this._index + len);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ С‡РёСЃР»Рѕ
		let int = 0;
		for (var i = str.length - 1; i >= 0; i--) {
			int = (int * 256) + str[i];
		}

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len;

		return int;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р±РµР·Р·РЅР°РєРѕРІРѕРіРѕ 64 СЂР°Р·СЂСЏРґРЅРѕРіРѕ С‡РёСЃР»Р°
	_toUint64() {
		// РџРѕР»СѓС‡Р°РµРј СЃС‚СЂРѕРєСѓ
		let bytes = this._rton.slice(this._index, this._index + 8);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ С‡РёСЃР»Рѕ
		let digits = [];
		bytes.forEach((byte, j) => {
			for (let i = 0; byte > 0 || i < digits.length; i++) {
				byte += (digits[i] || 0) * 0x100;
				digits[i] = byte % 10;
				byte = (byte - digits[i]) / 10;
			}
		});

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += 8;

		return digits.reverse().join('');
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р·РЅР°РєРѕРІРѕРіРѕ С‡РёСЃР»Р°
	_toFloat() {
		// РџРѕР»СѓС‡Р°РµРј СЃСЂРµР·
		let bytes = this._rton.slice(this._index, this._index + 4);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ float
		const floatView = new DataView(bytes.buffer);
		const float = floatView.getFloat32(0, true);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ СЃС‚СЂРѕРєСѓ Рё РґРѕР±Р°РІР»СЏРµРј РєРѕРЅРµС‡РЅС‹Р№ 0 РµСЃР»Рё РµРіРѕ РЅРµС‚
		let str = float.toString();
		str = str.indexOf('.') === -1 ? str + ".0" : str;

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += 4;

		return str;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р·РЅР°РєРѕРІРѕРіРѕ С‡РёСЃР»Р°
	_toDouble() {
		// РџРѕР»СѓС‡Р°РµРј СЃСЂРµР·
		let bytes = this._rton.slice(this._index, this._index + 8);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ double
		const doubleView = new DataView(bytes.buffer);
		const double = doubleView.getFloat64(0, true);

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј РІ СЃС‚СЂРѕРєСѓ Рё РґРѕР±Р°РІР»СЏРµРј РєРѕРЅРµС‡РЅС‹Р№ 0 РµСЃР»Рё РµРіРѕ РЅРµС‚
		let str = double.toString();
		str = str.indexOf('.') === -1 ? str + ".0" : str;

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += 8;

		return str;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р±РµР·Р·РЅР°РєРѕРІРѕРіРѕ С‡РёСЃР»Р° RTON
	_toUnum() {
		// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё СЃР°РјРѕ С‡РёСЃР»Рѕ
		let len = this._len(this._rton.slice(this._index, this._index + 8));
		let int = this._int(this._rton.slice(this._index, this._index + len));

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len;

		return int;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ Р·РЅР°РєРѕРІРѕРіРѕ С‡РёСЃР»Р° RTON
	_toNum() {
		// РџРѕР»СѓС‡Р°РµРј РґР»РёРЅСѓ С‡РёСЃР»Р° Рё СЃР°РјРѕ С‡РёСЃР»Рѕ
		let len = this._len(this._rton.slice(this._index, this._index + 8));
		let int = this._int(this._rton.slice(this._index, this._index + len));

		// РџСЂРµРѕР±СЂР°Р·СѓРµРј Р·РЅР°Рє
		if (int % 2)
			int = -(int + 1);
		int /= 2;

		// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
		this._index += len;

		return int;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ RTON РІ РјР°СЃСЃРёРІ
	_toArray() {
		// РЈРІРµР»РёС‡РёРІР°РµРј РёРЅРґРµРєСЃ РёР· Р·Р° 0xfd
		this._index++;

		// Р•СЃР»Рё РїСѓСЃС‚РѕР№ РјР°СЃСЃРёРІ
		if (this._rton[this._index] === 0x00) {
			// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
			this._index += 2;

			return;
		}

		// РџРѕР»СѓС‡Р°РµРј РєРѕР»РёС‡РµСЃС‚РІРѕ СЌР»РµРјРµРЅС‚РѕРІ РјР°СЃСЃРёРІР°
		let len = this._len(this._rton.slice(this._index, this._index + 8));
		let count = this._int(this._rton.slice(this._index, this._index + len));

		// РЈРІРµР»РёС‡РёРІР°РµРј РёРЅРґРµРєСЃ РёР· Р·Р° РєРѕР»РёС‡РµСЃС‚РІР° СЌР»РµРјРµРЅС‚РѕРІ
		this._index += len;

		this._format++;
		for (let i = 0; i < count; i++) {
			// Р¤РѕСЂРјР°С‚РёСЂСѓРµРј СЃС‚СЂРѕРєСѓ
			for (let t = 0; t < this._format; t++)
				this._result += "\t";

			// Р—Р°РїСѓСЃРєР°РµРј РїСЂРѕРІРµСЂРєСѓ
			this._type();

			// Р•СЃР»Рё РЅРµ РїРѕСЃР»РµРґРЅРёР№ СЌР»РµРјРµРЅС‚ РјР°СЃСЃРёРІР°
			if (i + 1 !== count)
				this._result += ",\n";
		}
		this._format--;

		// РЈРІРµР»РёС‡РёРІР°РµРј РёРЅРґРµРєСЃ РёР· Р·Р° 0xfe
		this._index++;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ RTON РІ РѕР±СЉРµРєС‚
	_toObject() {
		// Р•СЃР»Рё РїСѓСЃС‚РѕР№ РѕР±СЉРµРєС‚
		if (this._rton[this._index] === 0xff) {
			// РР·РјРµРЅСЏРµРј РёРЅРґРµРєСЃ
			this._index++;

			return;
		}

		this._format++;
		for (;this._index + 4 < this._rton.length;) {
			// Р¤РѕСЂРјР°С‚РёСЂСѓРµРј СЃС‚СЂРѕРєСѓ
			for (let t = 0; t < this._format; t++)
				this._result += "\t";

			// Р—Р°РїСѓСЃРєР°РµРј РїСЂРѕРІРµСЂРєСѓ
			this._type();
			this._result += ': ';
			this._type();

			// РџСЂРѕРІРµСЂСЏРµРј РЅР° РєРѕРЅРµС† РѕР±СЉРµРєС‚Р°
			if (this._rton[this._index] === 0xff) {
				break;
			} else {
				this._result += ",\n";
			}
		}
		this._format--;

		// РЈРІРµР»РёС‡РёРІР°РµРј РёРЅРґРµРєСЃ РёР· Р·Р° 0xff
		this._index++;
	}

	// РџРѕРґСЃС‡РµС‚ РєРѕР»РёС‡РµСЃС‚РІР° СЃРёРјРІРѕР»РѕРІ РІ С‡РёСЃР»Рµ RTON
	_len(bytes) {
		let length = 1;
		for (let y = 0; bytes[y] > 0x7f; y++)
			length++;

		return length;
	}

	// РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ RTON РІ С‡РёСЃР»Рѕ
	_int(bytes) {
		let res = 0;
		for (let i = bytes.length; i > 0; i--) {
			let byte = bytes[i - 1];
			if (res % 2 == 0)
				byte &= 0x7f;
			res /= 2;
			res = byte + parseInt(res) * 0x100;
		}

		return res;
	}

	// РћС‡РёСЃС‚РєР° СЃС‚СЂРѕРєРё РѕС‚ СЃРїРµС†СЃРёРјРІРѕР»РѕРІ
	_clearStr(str) {
		str = str.replaceAll(/\r\n|\r|\n/gi, '\\n');
		str = str.replaceAll(/\t/gi, "\\t");
		str = str.replaceAll('"', '\"');

		return str;
	}
}