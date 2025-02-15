package servlets;

import com.google.gson.Gson;
import database.tables.EditMessagesTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Message;

/**
 *
 * @author user
 */
@WebServlet(name = "MessagesVolunteer", urlPatterns = {"/MessagesVolunteer"})
public class MessagesVolunteer extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            EditMessagesTable editMessagesTable = new EditMessagesTable();
            ArrayList<Message> messages = editMessagesTable.getVolunteerMessages();

            Gson gson = new Gson();
            String messagesJson = gson.toJson(messages);

            out.write(messagesJson);
            out.flush();
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Unable to fetch messages.\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {

            StringBuilder requestBody = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                requestBody.append(line);
            }

            Gson gson = new Gson();
            Message message = gson.fromJson(requestBody.toString(), Message.class);

            message.setRecipient("admin");

            EditMessagesTable editMessagesTable = new EditMessagesTable();
            editMessagesTable.createNewMessage(message);

            out.write("{\"success\": \"Message sent successfully.\"}");
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Unable to send the message.\"}");
        }
    }
}
