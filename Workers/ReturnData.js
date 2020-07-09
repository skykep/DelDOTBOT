module.exports = {
   AdvisoryDE:  function returnData(y) { //format a comma seperated return for insertion into the sql database of relevent datapoints
   return [ y.id, y.where.location, y.timestamp, y.EventType, y.type.name, y.published.linkbackUrl, "", y.where.lat, y.where.lon, y.where.address.address1, y.where.county.name ];},
   ScheduleDE:  function returnData(y) { //format a comma seperated return for insertion into the sql database of relevent datapoints
   return [ y.strId, y.construction, y.startDate, y.EventType, y.releaseId, "", y.latitude, y.longitude, y.title, y.county ];},
};
