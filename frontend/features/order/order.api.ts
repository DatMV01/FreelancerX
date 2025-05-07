import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/orders";

const BASE = "/orders";
export const uploadFileUrl = () => `/file/upload`;

export const orderUrl = {
  buyer: `${BASE}/buyer`,
  admin: `${BASE}/admin`,
  freelancer: `${BASE}/freelancer`,

  freelancerQuery: (queryStr: string) => `${orderUrl.freelancer}?${queryStr}`,
  buyerQuery: (queryStr: string) => `${orderUrl.buyer}?${queryStr}`,
  adminQuery: (queryStr: string) => `${orderUrl.admin}?${queryStr}`,

  detail: (id: string) => `${BASE}/${id}`,
  action: (id: string) => `${BASE}/action/${id}`,
  submitAnswer: (questionId: string) =>
    `${BASE}/questions-answers/${questionId}`,
  addQuestion: `${BASE}/questions-answers`,
};

export const reviewUrl = {
  orderReview: (id: string) => `/reviews/order/${id}`,
};

export const getOrderById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(orderUrl.detail(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching order by id:", error);
    throw error;
  }
};

export const getOrderReviewById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(reviewUrl.orderReview(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching order review by id:", error);
    throw error;
  }
};

export const updateOrderByAction = async (
  id: string,
  action: string,
): Promise<any> => {
  try {
    const response = await axiosInstanceV1.patch(orderUrl.action(id), {
      action,
    });
    return response;
  } catch (error) {
    console.error("Error updateOrderByAction :", error);
    throw error;
  }
};

export const fetchOrdersByFreelancer = async (
  queryStr: string,
): Promise<any> => {
  return axiosInstanceV1.get(orderUrl.freelancerQuery(queryStr));
};

export const fetchOrdersByBuyer = async (queryStr: string): Promise<any> => {
  return axiosInstanceV1.get(orderUrl.buyerQuery(queryStr));
};

export const fetchOrdersByAdmin = async (queryStr: string): Promise<any> => {
  return axiosInstanceV1.get(orderUrl.adminQuery(queryStr));
};

// export const getOrderById = async (id: string): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching order by id:", error);
//     throw error;
//   }
// };

// export const getOrderReviewById = async (id: string): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(`/reviews/order/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching order review by id:", error);
//     throw error;
//   }
// };

// export const updateOrderByAction = async (
//   id: string,
//   action: string,
// ): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.patch(`/orders/action/${id}`, {
//       action: action,
//     });

//     return response;
//   } catch (error) {
//     console.error("Error updateOrderByAction :", error);
//     throw error;
//   }
// };

// export const fetchOrdersByFreelancer = async (
//   queryStr: string,
// ): Promise<any> => {
//   const response = await axiosInstanceV1.get(
//     `${API_URL}/freelancer?${queryStr}`,
//   );
//   return response;
// };

// export const fetchOrdersByBuyer = async (queryStr: string): Promise<any> => {
//   const response = await axiosInstanceV1.get(`${API_URL}/buyer?${queryStr}`);
//   return response;
// };

// export const fetchOrdersByAdmin = async (queryStr: string): Promise<any> => {
//   const response = await axiosInstanceV1.get(`${API_URL}/admin?${queryStr}`);
//   return response;
// };

type FetchOrderParams = {
  page?: number;
  limit?: number;
  filters?: string;
  fields?: string;
};

const fetchOrders = async (url: string, params: FetchOrderParams) => {
  try {
    const response = await axiosInstanceV1.get(url, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        filters: params.filters || "",
        fields: params.fields,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const fetchBuyerOrders = (params: FetchOrderParams) =>
  fetchOrders(orderUrl.buyer, params);

export const fetchAdminOrders = (params: FetchOrderParams) =>
  fetchOrders(orderUrl.admin, params);

export const fetchFreelancerOrders = (params: FetchOrderParams) =>
  fetchOrders(orderUrl.freelancer, params);

// export const fetchBuyerOrders = async ({
//   page = 1,
//   limit = 10,
//   filters = "",
//   fields,
// }: {
//   page: number;
//   limit: number;
//   filters: string;
//   fields?: string;
// }): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(`${API_URL}/buyer`, {
//       params: {
//         page,
//         limit,
//         filters,
//         fields,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     throw error;
//   }
// };

// export const fetchAdminOrders = async ({
//   page = 1,
//   limit = 10,
//   filters = "",
//   fields,
// }: {
//   page: number;
//   limit: number;
//   filters: string;
//   fields?: string;
// }): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(`${API_URL}/admin`, {
//       params: {
//         page,
//         limit,
//         filters,
//         fields,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetchAdminOrders:", error);
//     throw error;
//   }
// };

// export const fetchFreelancerOrders = async ({
//   page = 1,
//   limit = 10,
//   filters = "",
//   fields,
// }: {
//   page: number;
//   limit: number;
//   filters: string;
//   fields?: string;
// }): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(`${API_URL}/freelancer`, {
//       params: {
//         page,
//         limit,
//         filters,
//         fields,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     throw error;
//   }
// };

export const uploadFile = async (file: File) => {
  const fileForm = new FormData();
  fileForm.append("file", file);

  const { data, status } = await axiosInstanceV1.post(
    uploadFileUrl(),
    fileForm,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (status === 201) return data;
  throw new Error("Upload failed");
};

export const submitOrderAnswer = async (
  orderId: string,
  questionId: string,
  answer: string,
  file?: File,
): Promise<any> => {
  const formData = new FormData();
  formData.append("id", questionId);
  formData.append("orderId", orderId);
  formData.append("answer", answer);

  if (file) {
    const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
    const newFile = new File([file], newFileName, { type: file.type });
    const uploaded = await uploadFile(newFile);
    formData.append("file", JSON.stringify(uploaded));
  }

  return axiosInstanceV1.patch(orderUrl.submitAnswer(questionId), formData);
};

export const addOrderQuestion = async (
  orderId: string,
  question: string,
  file?: File,
): Promise<any> => {
  const formData = new FormData();
  formData.append("question", question);
  formData.append("orderId", orderId);

  if (file) {
    const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
    const newFile = new File([file], newFileName, { type: file.type });
    const uploaded = await uploadFile(newFile);
    formData.append("file", JSON.stringify(uploaded));
  }

  return axiosInstanceV1.post(orderUrl.addQuestion, formData);
};

// export const submitOrderAnswer = async (
//   orderId: string,
//   questionId: string,
//   answer: string,
//   file: any,
// ): Promise<any> => {
//   const formData = new FormData();
//   formData.append("id", questionId);
//   formData.append("orderId", orderId);
//   formData.append("answer", answer);

//   if (file) {
//     const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
//     const newFile = new File([file], newFileName, {
//       type: file.type,
//     });

//     const fileForm = new FormData();
//     fileForm.append("file", newFile);

//     const { data, status } = await axiosInstanceV1.post(
//       "/file/upload",
//       fileForm,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       },
//     );

//     if (status === 201) {
//       console.log("File uploaded successfully", data);
//       formData.append("file", JSON.stringify(data));
//     }
//   }

//   const response = await axiosInstanceV1.patch(
//     `/orders/questions-answers/${questionId}`,
//     formData,
//   );

//   return response;
// };

// export const addOrderQuestion = async (
//   orderId: string,
//   question: string,
//   file: any,
// ): Promise<any> => {
//   const formData = new FormData();
//   formData.append("question", question);
//   formData.append("orderId", orderId);

//   if (file) {
//     const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
//     const newFile = new File([file], newFileName, {
//       type: file.type,
//     });

//     const { data, status } = await axiosInstanceV1.post(
//       "/file/upload",
//       { file: newFile },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       },
//     );

//     if (status === 201) {
//       console.log("File uploaded successfully", data);
//       formData.append("file", JSON.stringify(data));
//     }
//   }

//   const response = await axiosInstanceV1.post(
//     "/orders/questions-answers",
//     formData,
//   );

//   return response;
// };
