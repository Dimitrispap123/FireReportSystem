package servlets;

import com.google.gson.Gson;
import database.tables.EditParticipantsTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
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
@WebServlet(name = "GetParticipants", urlPatterns = {"/GetParticipants"})
public class GetParticipants extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {

            EditParticipantsTable editParticipantsTable = new EditParticipantsTable();
            ArrayList<Participant> participants = editParticipantsTable.databaseToParticipants();

            Gson gson = new Gson();
            String jsonResponse = gson.toJson(participants);

            out.write(jsonResponse);
            response.setStatus(HttpServletResponse.SC_OK);

        } catch (SQLException | ClassNotFoundException ex) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\": \"error\", \"message\": \"" + ex.getMessage() + "\"}");
        }
    }

}
