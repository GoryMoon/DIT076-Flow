/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.User;
import com.fgm.flow.dao.UserRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.*;
import javax.ws.rs.core.UriInfo;
import com.google.gson.annotations.Expose;

/**
 *
 * @author fgm
 */
@Path("account")
public class AccountResource
{
    @Context
    private UriInfo uriInfo;

    @EJB
    private UserRegistry userReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();
    
    static class LoginData 
    {
        public String email; 
        public String password;
    }
    
        static class LoginDataOut
    {
        public Integer id; 
        public String nick;
        
        public LoginDataOut(User user)
        {
            this.id = user.getId();
            this.nick = user.getNick();
        }
    }
    
    @POST
    @Path("login")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response loginRequest(LoginData inData)
    {
        // Check user object
        if(inData.email == null || inData.password == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        List<User> usersWithEmail = userReg.findByEmail(inData.email);
        
        // Respond with status 'internal server error' if more than one use
        // is registered with the same email - shouldn't be possible
        if(usersWithEmail.size() != 1)
        {
            return Response.status(INTERNAL_SERVER_ERROR).build();
        }
        
        User user = usersWithEmail.get(0);
        
        // Respond woth status 'unauthorized' if an incorrect password has
        // been supplied for the user
        if(!user.getPassword().equals(inData.password))
        {
            return Response.status(UNAUTHORIZED).build();           
        }        
        
        // Respond with status 'ok' and the ID if login was successful
        return Response.ok(gson.toJson(new LoginDataOut(user))).build();
    }

    static class PutData 
    {
        public Integer userid;
        public Integer id;
        public String email;
        public String nick;
        public String password;
    }
    
    // Intended for updating user data
    @POST
    @Path("put")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response putRequest(PutData inData)
    {
        return Response.status(NOT_IMPLEMENTED).build();
    }
    
    static class RegisterData 
    {
        public String email;
        public String nick;
        public String password;
    }
    
    static class RegisterDataOut
    {
        public Integer id;
        public String nick;
        
        public RegisterDataOut(User user)
        {
            this.id = user.getId();
            this.nick = user.getNick();
        }
    }
            
    // For registering new user accounts
    @POST
    @Path("register")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response registerRequest(RegisterData inData)
    {
        // Check user object
        if(inData.email == null || inData.nick == null  || inData.password == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        List<User> usersWithEmail = userReg.findByEmail(inData.email);
        List<User> usersWithNick = userReg.findByNick(inData.nick);
        
        // Respond with status 'conflict' if the email or nick is registered 
        // already
        if(usersWithNick.size() != 0 || usersWithEmail.size() != 0)
        {
            return Response.status(CONFLICT).build();
        }
  
        User user = new User(inData.email, inData.nick, inData.password);    
        
        userReg.create(user);

        // Respond with status 'ok' and only the ID if the
        // nick did not already exists
        return Response.ok(gson.toJson(new RegisterDataOut(user))).build();
    }
}