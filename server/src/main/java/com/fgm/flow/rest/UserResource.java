/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.User;
import com.fgm.flow.core.UserGroup;
import com.fgm.flow.dao.UserRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.net.URI;
import java.util.List;
import static java.lang.System.out;
import java.util.Arrays;
import javax.ejb.EJB;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.*;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author fgm
 */
@Path("user")
public class UserResource {

    //private static final Logger LOG = Logger.getLogger(UserResource.class.getName());

    @Context
    private UriInfo uriInfo;

    @EJB
    private UserRegistry userReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();
    
    @POST
    @Path("register")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response register(User user)
    {
        // Check user object
        if(user.getEmail() == null || user.getNick() == null  || user.getPassword() == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        List<User> usersWithNick = userReg.findByNick(user.getNick());
        List<User> usersWithEmail = userReg.findByEmail(user.getEmail());
        
        // Respond with status 'conflict' if the nick already exists
        if(usersWithNick.size() != 0 || usersWithEmail.size() != 0)
        {
            return Response.status(CONFLICT).build();
        }

        User newUser = new User(user);
        
        userReg.create(newUser);

        // Respond with status 'ok' and only the ID if the
        // nick did not already exist
        return Response.ok(gson.toJson(newUser.getId())).build();
    }
    
    @POST
    @Path("login")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response login(User userEmailAndPass)
    {
        // Check user object
        if(userEmailAndPass.getEmail() == null || userEmailAndPass.getPassword() == null)
        {
            return Response.status(400).build();
        }
        
        List<User> usersWithEmail = userReg.findByEmail(userEmailAndPass.getEmail());
        
        // Respond with status 'internal server error' if more than one use
        // is registered with the same email - shouldn't be possible
        if(usersWithEmail.size() != 1)
        {
            return Response.status(INTERNAL_SERVER_ERROR).build();
        }
        
        User user = usersWithEmail.get(0);
        
        // Respond woth status 'unauthorized' if an incorrect password has
        // been supplied for the user
        if(!user.getPassword().equals(userEmailAndPass.getPassword()))
        {
            return Response.status(UNAUTHORIZED).build();           
        }        
        
        // Respond with status 'ok' and the ID if login was successful
        return Response.ok(gson.toJson(user.getId())).build();
    }
    
    
    
    
    @GET
    @Path("postcount/{userid : [0-9]+}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response countPosts(
            @PathParam("userid") int userId
        ) 
    {
        User user = userReg.find(userId);

        if(user == null)
        {
            return Response.status(400).build();
        }
        
        int count = user.getPosts().size();

        return Response.ok(gson.toJson(count)).build();
    }
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {
        List<User> users = userReg.findAll();
        return Response.ok(gsonEWE.toJson(users)).build();
    }
    
    
    
    
    
    
    @XmlRootElement
    static class GetData {
        public Integer userid;
        public Integer groupid;
        public Integer id;
        public String email; 
        public String nick;
        public Integer count;
    }
    // Windows CURL test
    // curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" "http://localhost:8080/api/user/get/" -d "{ \"userid\":1,\"groupid\":1,\"id\":1,\"email\":\"1\",\"nick\":\"1\",\"count\":5}"
    @POST
    @Path("get")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(GetData in) {
        if (in == null) return Response.status(BAD_REQUEST).build();
        if (in.groupid != null || in.email != null || in.nick != null || in.count != null) 
            return Response.status(NOT_IMPLEMENTED).build();
        
        if (userReg.find(in.userid) == null) 
            return Response.status(UNAUTHORIZED).build();
        
        if (in.id != null) { // handle id manually
            User u = userReg.find(in.id);
            if (u != null) return Response.ok(gsonEWE.toJson(Arrays.asList(u))).build();
            else return Response.status(NO_CONTENT).build();
        }
        
        // BEGINNING OF IMPL.
        
        List<User> users = userReg.findAll();
        return Response.ok(gsonEWE.toJson(users)).build();
    }
}
