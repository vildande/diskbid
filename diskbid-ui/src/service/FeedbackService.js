import axios from "axios";

const FEEDBACK_API_BASE_URL = "http://localhost:8080/api/v1/feedbacks";

class FeedbackService {
  sendFeedback(token, feedbackData) {
    const data = {
      subject: feedbackData.subject,
      description: feedbackData.description,
      senderId: feedbackData.senderId,
    };

    return axios.post(FEEDBACK_API_BASE_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getFeedbacks(token) {
    return axios.get(`${FEEDBACK_API_BASE_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteFeedbackById(token, id) {
    return axios.delete(`${FEEDBACK_API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new FeedbackService();
