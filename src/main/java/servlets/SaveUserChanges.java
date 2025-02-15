
import database.tables.EditUsersTable;
import mainClasses.User;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "SaveUserChanges", urlPatterns = {"/SaveUserChanges"})
public class SaveUserChanges extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        StringBuilder jsonBuilder = new StringBuilder();
        try ( BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }
        }

        String jsonData = jsonBuilder.toString();

        try {
            EditUsersTable userTable = new EditUsersTable();

            Gson gson = new Gson();
            User updatedUser = gson.fromJson(jsonData, User.class);


            userTable.updateUser(updatedUser.getUsername(), "email", updatedUser.getEmail());
            userTable.updateUser(updatedUser.getUsername(), "password", updatedUser.getPassword());
            userTable.updateUser(updatedUser.getUsername(), "firstname", updatedUser.getFirstname());
            userTable.updateUser(updatedUser.getUsername(), "lastname", updatedUser.getLastname());
            userTable.updateUser(updatedUser.getUsername(), "birthdate", updatedUser.getBirthdate());
            userTable.updateUser(updatedUser.getUsername(), "gender", updatedUser.getGender());
            userTable.updateUser(updatedUser.getUsername(), "afm", updatedUser.getAfm());
            userTable.updateUser(updatedUser.getUsername(), "country", updatedUser.getCountry());
            userTable.updateUser(updatedUser.getUsername(), "address", updatedUser.getAddress());
            userTable.updateUser(updatedUser.getUsername(), "municipality", updatedUser.getMunicipality());
            userTable.updateUser(updatedUser.getUsername(), "prefecture", updatedUser.getPrefecture());
            userTable.updateUser(updatedUser.getUsername(), "job", updatedUser.getJob());
            userTable.updateUser(updatedUser.getUsername(), "telephone", updatedUser.getTelephone());
            userTable.updateUser(updatedUser.getUsername(), "lat", String.valueOf(updatedUser.getLat()));
            userTable.updateUser(updatedUser.getUsername(), "lon", String.valueOf(updatedUser.getLon()));

            response.setStatus(HttpServletResponse.SC_OK);
            out.write("{\"status\": \"success\"}");

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(SaveUserChanges.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\": \"error\", \"message\": \"" + ex.getMessage() + "\"}");
        }
    }
}
