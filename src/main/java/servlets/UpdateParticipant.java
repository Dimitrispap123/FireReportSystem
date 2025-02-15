
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditParticipantsTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author user
 */
@WebServlet(name = "UpdateParticipant", urlPatterns = {"/UpdateParticipant"})
public class UpdateParticipant extends HttpServlet {

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
        ParticipantUpdate[] updates = gson.fromJson(jsonData, ParticipantUpdate[].class);

        try {
            EditParticipantsTable editParticipantsTable = new EditParticipantsTable();

            for (ParticipantUpdate update : updates) {
                HashMap<String, String> updateMap = new HashMap<>();
                for (String key : update.updates.keySet()) {
                    updateMap.put(key, update.updates.get(key));
                }

                editParticipantsTable.updateParticipant(update.participant_id, updateMap);
            }

            response.setStatus(HttpServletResponse.SC_OK);
            out.write("{\"status\": \"success\"}");

        } catch (SQLException | ClassNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    private static class ParticipantUpdate {

        String participant_id;
        HashMap<String, String> updates;
    }
}
