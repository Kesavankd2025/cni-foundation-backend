// import axios from "axios";

// // Environment variables or constants based on context
// const WA_API_URL = process.env.WA_API_URL || "https://api.adznetworkmedia.ca/v2/wamessage/sendMessage";
// const WA_API_KEY = process.env.WA_API_KEY || "147b26de-400b-11ef-ad4f-92672d2d0c2d";
// const WA_MOBILE = process.env.WA_MOBILE || "917200048371"; // Added 91 country code to the sender as typical in templates

// export interface WhatsAppResponse {
//     success: boolean;
//     data?: any;
//     error?: string;
//     errorCode?: string;
// }

// export class WhatsAppService {
//     /**
//      * Handle predefined WhatsApp errors
//      */
//     private static handleWhatsAppError(responseCode: string, defaultMessage: string): string {
//         switch (responseCode) {
//             case "WA002":
//                 return "Authentication failed (WA002). Check API Key.";
//             case "WA031":
//                 return "Placeholder mismatch (WA031). Ensure placeholder count matches template requirements.";
//             case "WA036":
//                 return "Insufficient balance (WA036). Top up WhatsApp API balance.";
//             default:
//                 return `WhatsApp API Error: ${defaultMessage || "Unknown Error"} (${responseCode})`;
//         }
//     }

//     /**
//      * Validate phone number format (checking for numerical format with country code length)
//      */
//     private static validatePhoneNumber(phone: string): boolean {
//         // Basic check for country code prefix and length (e.g. 91xxxxxxxxxx)
//         return /^\d{10,15}$/.test(phone);
//     }

//     /**
//      * Send a text message
//      * @param to receiver number with country code
//      * @param message text message body
//      */
//     public static async sendTextMessage(to: string, message: string): Promise<WhatsAppResponse> {
//         if (!this.validatePhoneNumber(to)) {
//             return {
//                 success: false,
//                 error: "Invalid phone number format. Must include country code and contain 10-15 digits."
//             };
//         }

//         if (!message || message.trim() === "") {
//             return {
//                 success: false,
//                 error: "Message content cannot be empty."
//             };
//         }

//         const payload = {
//             from: WA_MOBILE,
//             to: to,
//             type: "text",
//             message: {
//                 text: message
//             }
//         };

//         return this.makeApiCall(payload);
//     }

//     /**
//      * Send a template message
//      * @param to receiver number with country code
//      * @param templateId ID of the WhatsApp template
//      * @param placeholdersArray Array of placeholder strings needed for the template
//      */
//     public static async sendTemplateMessage(to: string, templateId: string, placeholdersArray: string[]): Promise<WhatsAppResponse> {
//         if (!this.validatePhoneNumber(to)) {
//             return {
//                 success: false,
//                 error: "Invalid phone number format. Must include country code and contain 10-15 digits."
//             };
//         }

//         if (!templateId) {
//             return {
//                 success: false,
//                 error: "Template ID is required."
//             };
//         }

//         if (!Array.isArray(placeholdersArray)) {
//             return {
//                 success: false,
//                 error: "Placeholders must be an array."
//             };
//         }

//         const payload = {
//             from: WA_MOBILE,
//             to: to,
//             type: "template",
//             message: {
//                 templateid: templateId,
//                 placeholders: placeholdersArray
//             }
//         };

//         return this.makeApiCall(payload);
//     }

//     /**
//      * Generic API caller for WhatsApp API wrapper
//      */
//     private static async makeApiCall(payload: any): Promise<WhatsAppResponse> {
//         console.log("\n--- WhatsApp API Request ---");
//         console.log("URL:", WA_API_URL);
//         console.log("Payload:", JSON.stringify(payload, null, 2));

//         try {
//             const response = await axios.post(WA_API_URL, payload, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "apikey": WA_API_KEY
//                 }
//             });

//             console.log("--- WhatsApp API Response ---");
//             console.log("Body:", JSON.stringify(response.data, null, 2));

//             const data = response.data;
            
//             // Attempt to intercept common error formats if any
//             const strResp = JSON.stringify(data);
//             const errorMatch = strResp.match(/(WA002|WA031|WA036)/);
            
//             // if response is error (depending on API's standard success response mapping)
//             // Some APIs return 200 OK along with error=true or status="error"
//             if (errorMatch && (data.status === "error" || data.status === false || data.error || data.errorCode)) {
//                  const errorCode = errorMatch[1];
//                  const errorMsg = this.handleWhatsAppError(errorCode, data.message || "API returned an error");
//                  console.error(`--> WhatsApp Error handled: ${errorMsg}`);
//                  return { success: false, error: errorMsg, errorCode };
//             }

//             // Fallback for custom logic if non-200 like behavior but 200 HTTP response
//             if (data && (data.error || data.status === "error")) {
//                 const errCode = data.errorCode || "Unknown";
//                 return { success: false, error: data.message || "WhatsApp API returned an error status", errorCode: errCode };
//             }

//             return { success: true, data: response.data };

//         } catch (error: any) {
//             console.error("--- WhatsApp API Request Failed ---");
//             const responseData = error?.response?.data;
//             console.error(responseData || error.message);
            
//             // Extract error from Axios response
//             if (responseData && typeof responseData === 'object') {
//                 const strResp = JSON.stringify(responseData);
//                 const errorMatch = strResp.match(/(WA002|WA031|WA036)/);
//                 if (errorMatch) {
//                     const errorMsg = this.handleWhatsAppError(errorMatch[1], responseData.message || error.message);
//                     return { success: false, error: errorMsg, errorCode: errorMatch[1] };
//                 }
//             }

//             return { 
//                 success: false, 
//                 error: `HTTP/Network Error: ${error.message} - ${JSON.stringify(responseData || '')}` 
//             };
//         }
//     }
// }
