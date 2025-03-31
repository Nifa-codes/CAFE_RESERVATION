const genrate=require('../securities/generators');
function cafeService(cafeRepository) {
 const addCafe = async function(cafeData) {
    try 
    {
        // HH:MM__HH:MM
      const oppeningHoursRegEx = /^(?:[01]\d|2[0-3]):[0-5]\d__(?:[01]\d|2[0-3]):[0-5]\d$/;
      const nameRegEx =/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
      const phoneRegEx = /^09\d{9}$/;
      if(!oppeningHoursRegEx.test(cafeData.oppeningHours)) 
      { 
        throw new Error('Oppening Hours must be in HH:MM__HH:MM format');
      }
      if(!nameRegEx.test(cafeData.name)||!phoneRegEx.test(cafeData.phone))
      {
        throw new Error('Name and Phone must be valid');
      }

      const existingCafe = await cafeRepository.searchCafeByNumber(cafeData.phone);
      if (existingCafe) 
      {
        throw new Error('Cafe already exists');
      }
      const newCafe = {
        id:genrate.generateId(),
        name:cafeData.name,
        address:cafeData.address,
        oppeningHours:cafeData.oppeningHours,
        phone:cafeData.phone
      }
      await cafeRepository.addCafe(newCafe);
      return { message: 'Cafe added successfully' };
    } 
    catch (error) {
      console.error(error);
      throw new Error(`Error adding cafe: ${error.message}`);
    }
}
    const editCafe = async function(id, cafeData) {
      try 
      {
        const existingCafe = await cafeRepository.getCafeById(id);
        if (!existingCafe) {
          throw new Error('Cafe not found');
        }
        await cafeRepository.editCafe(id, cafeData);
        return { message: 'Cafe updated successfully' };
      }
      catch (error) {
        console.error(error);
        throw new Error('Error updating cafe');
      }
    }
    const deleteCafe = async function(id) {
        try 
        {
          const existingCafe = await cafeRepository.getCafeById(id);
          if (!existingCafe) {
            throw new Error('Cafe not found');
          }
          await cafeRepository.deleteCafe(id);
          return { message: 'Cafe deleted successfully' };
        }
        catch (error) {
          console.error(error);
          throw new Error('Error deleting cafe');
        }
    }
    //search for name
    const searchCafe = async function(query, page, limit) {
        try 
        {
            const offset=(page-1)*limit;
            const result = await cafeRepository.searchCafes(query, limit, offset);
            return{cafes:result.cafes, totalCount:result.totalCount};
        }
        catch (error) {
            console.error(error);
            throw new Error('Error searching cafe');
        }
    }
    const listCafes = async function(page, limit) {
        try
        {

            const offset=(page-1)*limit;
            const result = await cafeRepository.listCafes(limit,offset);
            return{cafes:result.cafes, totalCount:result.totalCount};
        }
        catch (error) {
            console.error(error);
            throw new Error('Error fetching cafes');
        }
        
    }

  return { addCafe, editCafe, deleteCafe, searchCafe, listCafes};
}
module.exports = {cafeService};