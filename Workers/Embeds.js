module.exports = {
	DEAdvisoryClose: function CloseEmbed(d) {
      var wmelink=`https://www.waze.com/en-US/editor?env=usa&lon=${d.where.lon}&lat=${d.where.lat}&zoom=6&marker=true`;
      var lmlink=`https://www.waze.com/livemap?lon=${d.where.lon}&lat=${d.where.lat}&zoom=17`;
      var applink=`https://www.waze.com/ul?ll=${d.where.lat},${d.where.lon}`;
      if (d.where.address.address1 != null) {
			var location = d.where.address.address1;
      } else { 
			var location = d.where.county.name; 
      }
      if (d.type.name == "Construction") {
			var colorcode = "0xFF6B00";
      } else {
			var colorcode = "0xFF0000";
      }
	  var updateTime = new Date(d.timestamp).toLocaleString();
		var closeembed = {
			"embed": {
				color: colorcode,
				title: `${d.Status} ${d.type.name}`,
				url: d.published.linkbackUrl,
				author: {
					name: 'DelDOT DataFeed (Advisory Closure)',
					icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
					url: 'https://deldot.gov',
				},
				//description: row.desc,
				thumbnail: {
					url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
				},
				fields: [
					{
						name: 'Reason',
						value: d.where.location,
					},
					{
						name: 'Location',
						value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
					},
				],
				timestamp: updateTime,
				footer: {
					text: "Event " + d.id + " updated at ",
				},
			}
		};
		return closeembed;
	},
	DEAdvisoryOpen: function OpenEmbed(d) {
      var wmelink=`https://www.waze.com/en-US/editor?env=usa&lon=${d.Lon}&lat=${d.Lat}&zoom=6&marker=true`;
      var lmlink=`https://www.waze.com/livemap?lon=${d.Lon}&lat=${d.Lat}&zoom=17`;
      var applink=`https://www.waze.com/ul?ll=${d.Lat},${d.Lon}`;
      if (d.Address != null) {
			var location = d.Address;
      } else { 
			var location = d.County; 
      }
      if (d.AdvisoryType == "Construction") {
			var colorcode = "0xFF6B00";
      } else {
			var colorcode = "0xFF0000";
      }
	  var updateTime = new Date().toLocaleString();
		var openembed = {
			"embed": {
				color: 0x00ff00,
				title: `(OPEN) - ${d.AdvisoryType}`,
				url: d.Link,
				author: {
					name: 'DelDOT DataFeed (Advisory Closure)',
					icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
					url: 'https://deldot.gov',
				},
				//description: row.desc,
				thumbnail: {
					url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
				},
				fields: [
					{
						name: 'Reason',
						value: d.Desc.replace("IS CLOSED","*was* CLOSED"),
					},
					{
						name: 'Location',
						value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
					},
				],
				timestamp: updateTime,
				footer: {
					text: `Event ${d.EventID} updated at`,
				},
			}
		};
		return openembed;
	},
	DEScheduleClose: function CloseEmbed(d) {
      var wmelink=`https://www.waze.com/en-US/editor?env=usa&lon=${d.longitude}&lat=${d.latitude}&zoom=6&marker=true`;
      var lmlink=`https://www.waze.com/livemap?lon=${d.longitude}&lat=${d.latitude}&zoom=17`;
      var applink=`https://www.waze.com/ul?ll=${d.latitude},${d.longitude}`;
		if ((d.releaseId != "-1") && (d.releaseId != undefined)) {
			releaseURL = `https://deldot.gov/About/news/index.shtml?dc=release&id=${d.releaseId}`;
		} else {
			releaseURL = "";
		}
		var closeembed = {
			"embed": {
				color: 0xffff00,
				title: d.title,
				url: releaseURL, 
				author: {
					name: 'DelDOT DataFeed (Scheduled Closure)',
					icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
					url: 'https://deldot.gov',
				},
				thumbnail: {
					url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
				},
				fields: [
					{
						name: 'Reason',
						value: d.construction.replace(/<br \/>/g,""),
					},
					{
						name: 'Location',
						value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
					},
				   {
						name: 'Dates',
						value: d.startDate,
					},
					{
						name: 'County',
						value: d.county.replace(" County",""),
					},
				],
				timestamp: new Date(d.timestamp).toLocaleString(),
				footer: {
					text: "Scheduled Closure " + d.strId,
				},
			}
		};
		return closeembed;
	},
	DEScheduleOpen: function OpenEmbed(d) {
      var wmelink=`https://www.waze.com/en-US/editor?env=usa&lon=${d.Lon}&lat=${d.Lat}&zoom=6&marker=true`;
      var lmlink=`https://www.waze.com/livemap?lon=${d.Lon}&lat=${d.Lat}&zoom=17`;
      var applink=`https://www.waze.com/ul?ll=${d.Lat},${d.Lon}`;
		if ((d.releaseId != "-1") && (d.releaseId != undefined)) {
			releaseURL = `https://deldot.gov/About/news/index.shtml?dc=release&id=${d.releaseId}`;
		} else {
			releaseURL = "";
		}
		var openembed = {
			"embed": {
				color: 0x00ff00,
				title: d.Address,
				url: releaseURL, 
				author: {
					name: 'DelDOT DataFeed (Scheduled Closure)',
					icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
					url: 'https://deldot.gov',
				},
				thumbnail: {
					url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
				},
				fields: [
					{
						name: 'Reason',
						value: d.Desc,
					},
					{
						name: 'Location',
						value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
					},
				   {
						name: 'Dates',
						value: d.TimeStamp,
					},
					{
						name: 'County',
						value: d.County.replace(" County",""),
					},
				],
				timestamp: new Date(),
				footer: {
					text: "Scheduled Closure " + d.EventID + " updated at ",
				},
			}
		};
		return openembed;
	}
};
