package servlets;

import com.google.gson.Gson;
import database.tables.EditParticipantsTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Participant;

/**
 *
 * @author user
 */
@WebServlet(name = "JoinIncident", urlPatterns = {"/JoinIncident"})
public class JoinIncident extends HttpServlet {

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
        Gson gson = new Gson();

        Participant participant = gson.fromJson(jsonData, Participant.class);

        EditParticipantsTable editParticipantsTable = new EditParticipantsTable();
        try {

            editParticipantsTable.createNewParticipant(participant);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(JoinIncident.class.getName()).log(Level.SEVERE, null, ex);
        }
        response.setStatus(HttpServletResponse.SC_OK);
        out.write("{\"status\": \"success\"}");
    }
}
