class Instrument {
	constructor(_row='') {
		const row = _row.split(',');
		
		if (row.length !== 18) throw new Error('Invalid Instrument data!');

		// unspecified ones are all string
		this.InsCode      = row[0];  // int64 (long)
		this.InstrumentID = row[1];
		this.LatinSymbol  = row[2];
		this.LatinName    = row[3];
		this.CompanyCode  = row[4];
		this.Symbol       = row[5];
		this.Name         = row[6];
		this.CIsin        = row[7];
		this.DEven        = row[8];  // int32 (int)
		this.Flow         = row[9];  // byte
		this.LSoc30       = row[10];
		this.CGdSVal      = row[11];
		this.CGrValCot    = row[12];
		this.YMarNSC      = row[13];
		this.CComVal      = row[14];
		this.CSecVal      = row[15];
		this.CSoSecVal    = row[16];
		this.YVal         = parseInt(row[17], 10);
	}
}

export default async function () {
	const res = await $.ajax('app/instruments.csv');
	return res.split('\r\n').map( i => new Instrument(i) );
}