const asyncHandler = require("../middleware/asyncHandler");
function cafeController(cafeService) {
  const addCafe = asyncHandler(async function (req, res) {
    const { name, address, phone, oppeningHours } = req.body;
    const cafe = { name, address, phone, oppeningHours };
    const result = await cafeService.addCafe(cafe);
    return res.status(201).json({ result });
  });

  const editCafe = asyncHandler(async function (req, res) {
    const id = req.params.id;
    const { name, address, phone, oppeningHours } = req.body;
    const cafe = { name, address, phone, oppeningHours };
    const result = await cafeService.editCafe(id, cafe);
    return res.status(200).json({ message: result });
  });

  const deleteCafe = asyncHandler(async function (req, res) {
    const id = req.params.id;
    const result = await cafeService.deleteCafe(id);
    res.status(200).json({ message: result });
  });

  const searchCafe = asyncHandler(async function (req, res) {
    const query = req.query.q;
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (!page || !limit) {
      page = 1;
      limit = 10;
    }
    const result = await cafeService.searchCafe(query, page, limit);
    return res.status(200).json({
      page: page,
      limit: limit,
      totalCount: result.totalCount.count,
      totalPages: Math.ceil(result.totalCount.count / limit),
      data: result.cafes,
    });
  });

  const listCafes = asyncHandler(async function (req, res) {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (!page || !limit) {
      page = 1;
      limit = 10;
    }
    const result = await cafeService.listCafes(page, limit);
    return res.status(200).json({
      page: page,
      limit: limit,
      totalCount: result.totalCount.count,
      totalPages: Math.ceil(result.totalCount.count / limit),
      data: result.cafes,
    });
  });
  return { addCafe, editCafe, searchCafe, deleteCafe, listCafes };
}
module.exports = { cafeController };
