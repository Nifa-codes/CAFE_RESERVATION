/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management
 */
function reserveController(reserveService)
{
   /**
   * @swagger
   * /api/reserves/add:
   *   post:
   *     summary: Add a new reservation
   *     description: Create a new reservation.
   *     tags: [Reservations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cafe_id:
   *                 type: string
   *               users_id:
   *                 type: string
   *               tables_id:
   *                 type: string
   *               orders_id:
   *                 type: string
   *                 description: Order ID; if not provided, it will be generated.
   *               reserve_time:
   *                 type: string
   *                 description: Format `YYYY-MM-DD HH:MM:SS`
   *               status:
   *                 type: string
   *             required:
   *               - cafe_id
   *               - users_id
   *               - tables_id
   *               - reserve_time
   *               - status
   *             example:
   *               cafe_id: "cafe123"
   *               users_id: "user456"
   *               tables_id: "table789"
   *               reserve_time: "2025-05-01 18:00:00"
   *               status: "confirmed"
   *     responses:
   *       201:
   *         description: Reservation added successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Reservation added successfully"
   *       500:
   *         description: Error adding reservation.
   */
    const addReservation = async function(req, res) {
        try {
          let { cafe_id, users_id, tables_id, orders_id, reserve_time, status } = req.body;
          const reservationData = { cafe_id, users_id, tables_id, orders_id, reserve_time, status };
          const result = await reserveService.addReservation(reservationData);
          return res.status(201).json({ result });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
       
    }
     /**
   * @swagger
   * /api/reserves/edit/{id}:
   *   put:
   *     summary: Update a reservation
   *     description: Update reservation details by its ID.
   *     tags: [Reservations]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Reservation ID.
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cafe_id:
   *                 type: string
   *               users_id:
   *                 type: string
   *               tables_id:
   *                 type: string
   *               orders_id:
   *                 type: string
   *               reserve_time:
   *                 type: string
   *               status:
   *                 type: string
   *             example:
   *               cafe_id: "cafe123"
   *               users_id: "user456"
   *               tables_id: "table789"
   *               reserve_time: "2025-05-01 18:00:00"
   *               status: "updated"
   *     responses:
   *       200:
   *         description: Reservation updated successfully.
   *       500:
   *         description: Error updating reservation.
   */
    const editReservation = async function(req, res) {
        try {
          const id = req.params.id;
          const { cafe_id, users_id, tables_id, orders_id, reserve_time, status } = req.body;
          const reservationData = { cafe_id, users_id, tables_id, orders_id, reserve_time, status };
          const result = await reserveService.editReservation(id, reservationData);
          return res.status(200).json({ message: result });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
   /**
   * @swagger
   * /api/reserves/delete/{id}:
   *   delete:
   *     summary: Delete a reservation
   *     description: Delete a reservation by its ID.
   *     tags: [Reservations]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Reservation ID.
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Reservation deleted successfully.
   *       500:
   *         description: Error deleting reservation.
   */
    const deleteReservation = async function(req, res) {
        try {
          const id = req.params.id;
          const result = await reserveService.deleteReservation(id);
          return res.status(200).json({ message: result });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
    /**
   * @swagger
   * /api/reserves/search:
   *   get:
   *     summary: Search reservations
   *     description: Search reservations with a query string and pagination.
   *     tags: [Reservations]
   *     parameters:
   *       - in: query
   *         name: q
   *         description: Search query.
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         description: Page number.
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         description: Items per page.
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Returns search results with reservations.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 reserves:
   *                   type: array
   *                   items:
   *                     type: object
   *                 totalCount:
   *                   type: integer
   *       500:
   *         description: Error searching reservations.
   */
    const searchReservations = async function(req, res) {
        try {
          const query = req.query.q;
          let page = parseInt(req.query.page);
          let limit = parseInt(req.query.limit);
          if (!page || !limit) {
            page = 1;
            limit = 10;
          }
          const result = await reserveService.searchReservations(query, page, limit);
          return res.status(200).json({
            page: page,
            limit: limit,
            totalCount: result.totalCount,
            totalPages: Math.ceil(result.totalCount/ limit),
            data: result.reservations,
          });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    } 
     /**
   * @swagger
   * /api/reserves/filter/{filterKey}/{id}:
   *   get:
   *     summary: List reservations by a specific foreign key
   *     description:
   *      List reservations filtered by a foreign key. 
   *     tags: [Reservations]
   *     parameters:
   *       - in: path
   *         name: filterKey
   *         required: true
   *         description: The key to filter by.
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID associated with the filter key.
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         description: Page number.
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         description: Items per page.
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Returns a filtered list of reservations.
   *       500:
   *         description: Error listing reservations.
   */
    const listReservationsByFK = async function(req, res) {
        try {
            //users_id, cafe_id, tables_id, orders_id
          const filterKey = req.params.filterKey; 
          const id = req.params.id;
          let page = parseInt(req.query.page);
          let limit = parseInt(req.query.limit);
          if (!page || !limit) {
            page = 1;
            limit = 10;
          }
          const result = await reserveService.listReservations(filterKey, id, page, limit);
          return res.status(200).json({
            page: page,
            limit: limit,
            totalCount: result.totalCount,
            totalPages: Math.ceil(result.totalCount / limit),
            data: result.reservations,
          });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
    return{addReservation, editReservation, deleteReservation, searchReservations, listReservationsByFK};
}
module.exports={reserveController};