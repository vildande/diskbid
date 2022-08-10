import axios from "axios";

const BID_API_BASE_URL = "http://localhost:8080/api/v1/bids";

class BidService {
  getActiveBids(token) {
    return axios.get(BID_API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getClosedBids(token) {
    return axios.get(`${BID_API_BASE_URL}/closed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getNotChosenClosedBids(token) {
    return axios.get(`${BID_API_BASE_URL}/results`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  getBidsOfNotChosenClosedBids(token, id) {
    return axios.get(`${BID_API_BASE_URL}/results/${id}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getClosedBid(token, id) {
    return axios.get(`${BID_API_BASE_URL}/closed/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getBidById(token, id) {
    return axios.get(`${BID_API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getBidsOfActiveProduct(token, id) {
    return axios.get(`${BID_API_BASE_URL}/${id}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getBidsOfClosedProduct(token, id) {
    return axios.get(`${BID_API_BASE_URL}/closed/${id}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getPendingBidsByOwnerId(token, id) {
    return axios.get(`${BID_API_BASE_URL}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ownerId: id,
      },
    });
  }

  sendProductForBid(token, productBidData) {
    const data = {
      name: productBidData.name,
      description: productBidData.description,
      minBidAmount: productBidData.startAmount,
      bidStep: productBidData.step,
      minutes: productBidData.minutes,
      ownerId: productBidData.ownerId,
      owner: productBidData.owner,
    };
    const image = productBidData.image;

    const json = JSON.stringify(data);
    const blob = new Blob([json], {
      type: "application/json",
    });

    const fd = new FormData();
    fd.append("productBid", blob);
    fd.append("image", image);
    console.log(fd["productBid"]);
    return axios.post(`${BID_API_BASE_URL}/add`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deletePendingProductBid(token, productId) {
    return axios.delete(`${BID_API_BASE_URL}/delete/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getImage(token, imageName) {
    return axios.get(`${BID_API_BASE_URL}/images/${imageName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
  }
  getPendingBid(token, userId, productId) {
    return axios.get(`${BID_API_BASE_URL}/delete/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ownerId: userId,
      },
    });
  }

  placeBidforProduct(token, productId, userId, amount) {
    const data = {
      productBidId: productId,
      bidderId: userId,
      amount: amount,
    };
    return axios.post(`${BID_API_BASE_URL}/${productId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getAllPendingBids(token) {
    return axios.get(`${BID_API_BASE_URL}/pending/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getByAdminPendingBid(token, id) {
    return axios.get(`${BID_API_BASE_URL}/pending/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteByAdminPendingProductBid(token, id) {
    return axios.delete(`${BID_API_BASE_URL}/pending/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  acceptPendingProductBid(token, id) {
    const data = {
      id: id,
      accepted: true,
    };

    return axios.patch(`${BID_API_BASE_URL}/pending/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  selectWinner(token, productId, winnerId) {
    return axios.patch(
      `${BID_API_BASE_URL}/results/${productId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { winnerId: winnerId },
      }
    );
  }
}

export default new BidService();
