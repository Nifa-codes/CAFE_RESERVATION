function cafeRepository(db) {
 const searchCafeByNumber = async function(number) {
    let numberEx=number.slice(1);
    numberEx=`098${numberEx}`;
    return await db.oneOrNone('SELECT * FROM cafe WHERE contact_number=$1', [numberEx]);
 }
 const addCafe = async function(cafe) {
    let numberEx=cafe.phone.slice(1);
    numberEx=`098${numberEx}`;
    return await db.none('INSERT INTO cafe (id, name, contact_number, address, oppening_hours) VALUES ($1, $2, $3, $4, $5)', [cafe.id, cafe.name, numberEx, cafe.address, cafe.oppeningHours]);
 }
 const editCafe = async function(id,cafe) {
    let i=2;
    let valuesQ=[];
    valuesQ[0]=id;
    let query='UPDATE cafe SET id=$1'
    if(cafe.name)
        {
        let nameQ=`,name=$${i}`;
        valuesQ[i-1]=cafe.name;
        i++;
        query=query+nameQ;
        }
    if(cafe.address)
        {
        let addressQ=`,address=$${i}`;
        valuesQ[i-1]=cafe.address;
        i++;
        query=query+addressQ;
        }
    if(cafe.openingHours)
        {
        let oppeningHoursQ=`,oppening_hours=$${i}`;
        valuesQ[i-1]=cafe.openingHours;
        i++;
        query=query+oppeningHoursQ;
        }
    if(cafe.phone)
        {
        let phoneQ=`,contact_number=$${i}`;
        let phone=cafe.phone.slice(1);
        phone=`098${phone}`;
        valuesQ[i-1]=phone;
        i++;
        query=query+phoneQ;
        }
    
    query=query+` WHERE id=$1`;
    return await db.none(query,valuesQ);
 }
 const deleteCafe = async function(id){
    return await db.none('DELETE FROM cafe WHERE id=$1', [id]);
 }
 const searchCafes = async function(query, limit,offset){
    const cafes=await db.any('SELECT * FROM cafe WHERE name ILIKE $1 LIMIT $2 OFFSET $3', [ `%${query}%`, limit, offset]);
    const totalCount= await db.one('SELECT COUNT(*) FROM cafe WHERE name ILIKE $1', [ `%${query}%`]);
    return {cafes, totalCount};
 }
 const listCafes = async function(limit, offset){
    const cafes=await db.any('SELECT * FROM cafe LIMIT $1 OFFSET $2', [limit, offset]);
    const totalCount= await db.one('SELECT COUNT(*) FROM cafe');
    return {cafes, totalCount};
 }
 const getCafeById = async function(id){
    return await db.oneOrNone('SELECT * FROM cafe WHERE id=$1', [id]);
 }
 return {searchCafeByNumber, addCafe, editCafe, deleteCafe, searchCafes, listCafes, getCafeById};
}
module.exports = {cafeRepository};