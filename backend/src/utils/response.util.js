/**
 * tiện ích chuẩn hóa định dạng dữ liệu phản hồi api cho toàn hệ thống
 * tuân thủ theo quy chuẩn thiết kế tại mục 3.2 của dự án:
 * - thành công: { "success": true, "message": "...", "data": { ... } }
 * - lỗi: { "success": false, "error": { "code": "...", "message": "...", "details": [ ... ] } }
 */

const ApiResponse = {
  /**
   * trả về phản hồi thành công
   * @param {object} res - đối tượng response của express
   * @param {string} message - thông điệp thông báo
   * @param {any} data - dữ liệu trả về cho frontend
   * @param {number} statusCode - mã trạng thái http (mặc định 200)
   */
  success: (res, message = 'thao tác thành công', data = null, statusCode = 200) => {
    const responseBody = {
      success: true,
      message,
    };
    if (data !== null && data !== undefined) {
      responseBody.data = data;
    }
    return res.status(statusCode).json(responseBody);
  },

  /**
   * trả về phản hồi lỗi
   * @param {object} res - đối tượng response của express
   * @param {string} message - mô tả lỗi dễ hiểu cho người dùng
   * @param {string} code - mã lỗi định danh (ví dụ: VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN)
   * @param {array|null} details - chi tiết lỗi theo từng trường (dùng cho form validation)
   * @param {number} statusCode - mã trạng thái http (mặc định 400)
   */
  error: (res, message = 'đã có lỗi xảy ra', code = 'BAD_REQUEST', details = null, statusCode = 400) => {
    const errorBody = {
      code,
      message,
    };
    if (details) {
      errorBody.details = details;
    }
    return res.status(statusCode).json({
      success: false,
      error: errorBody,
    });
  },
};

module.exports = ApiResponse;

