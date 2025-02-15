package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import database.tables.EditUsersTable;
import database.tables.EditVolunteersTable;
import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "Register", urlPatterns = {"/Register"})
public class Register extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder jsonBuilder = new StringBuilder();
        try ( BufferedReader reader = request.getReader()) {
            String currentLine;
            while ((currentLine = reader.readLine()) != null) {
                jsonBuilder.append(currentLine);
            }
        }

        String jsonData = jsonBuilder.toString();
        Gson gson = new Gson();
        EditUsersTable userTable = new EditUsersTable();
        EditVolunteersTable volunteerTable = new EditVolunteersTable();

        try {

            JsonObject parsedData = gson.fromJson(jsonData, JsonObject.class);

            String userType = parsedData.has("type")
                    ? parsedData.get("type").getAsString()
                    : "Volunteer";

            if ("Volunteer".equalsIgnoreCase(userType)) {

                volunteerTable.addVolunteerFromJSON(jsonData);
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"message\": \"Volunteer successfully registered.\"}");
            } else {

                userTable.addUserFromJSON(jsonData);
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"message\": \"User successfully registered.\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"An error occurred while processing the registration.\"}");
        }
    }
}
