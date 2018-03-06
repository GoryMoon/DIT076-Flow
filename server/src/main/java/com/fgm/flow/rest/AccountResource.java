/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.Membership;
import com.fgm.flow.core.User;
import com.fgm.flow.core.UserGroup;
import com.fgm.flow.dao.MembershipRegistry;
import com.fgm.flow.dao.UserGroupRegistry;
import com.fgm.flow.dao.UserRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.List;
import java.util.ArrayList;
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
import static java.util.Collections.sort;
import java.util.Comparator;
import static com.fgm.flow.service.TestingStatusSupplier.TESTING_DISABLED;

import static java.lang.System.out;

/**
 *
 * @author fgm
 */
@Path("account")
public class AccountResource
{
    // Should probably live in it's own file with the related get method -
    // only get it with getPublicGroup
    private static UserGroup publicGroup; 
    
    @Context
    private UriInfo uriInfo;

    @EJB
    private UserRegistry userReg;
    @EJB
    private UserGroupRegistry uGroupReg;
    @EJB
    private MembershipRegistry memshipReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();

    public static class GetData 
    {
        public Integer userid;
        public Integer groupid;
        public Integer id;
        public String email;
        public String nick;
        public Integer count;
    }
    
    public static class GetDataOut
    {
        public Integer id; 
        public String nick;
        
        public GetDataOut(User user)
        {
            this.id = user.getId();
            this.nick = user.getNick();
        }
    }
    
    @POST
    @Path("get")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(GetData inData)
    {
        // The fields id, email and nick are currentlty ignored 
        
        if(inData.userid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        
        // Return status 'not found' if user does not exist
        if(user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        // For searching for specific user id, email or nick
        if(inData.id != null)
        {           
            User usr = userReg.find(inData.id);
            
            if(usr == null)
            {
                return Response.status(NOT_FOUND).build();
            }
            
            if(inData.email != null 
                    && !usr.getEmail().equals(inData.email)
            )
            {
                 return Response.status(NOT_FOUND).build();
            }
            
            if(inData.nick != null && !usr.getNick().equals(inData.nick))
            {
                return Response.status(NOT_FOUND).build();
            }  
            
            return Response.ok(gson.toJson(new GetDataOut(usr))).build();
        }
        // ... email or nick   
        if(inData.email != null)
        {   
            List<User> usrList = userReg.findByEmail(inData.email);
            
            User usr = null;
            
            switch(usrList.size())
            {
                case 0:
                return Response.status(NOT_FOUND).build();
                
                case 1:
                usr = usrList.get(0);
                if(inData.nick != null && !usr.getNick().equals(inData.nick))
                {
                    return Response.status(NOT_FOUND).build();
                }
                return Response.ok(gson.toJson(new GetDataOut(usr))).build(); 
                
                default:
                throw new IllegalStateException("More than one user with the"
                        + "same email");
            }
        }
        
        // ... nick
        if(inData.nick != null)
        {
            List<User> usrList = userReg.findByNick(inData.nick);
            
            User usr = null;
            
            switch(usrList.size())
            {
                case 0:
                return Response.status(NOT_FOUND).build();
                
                case 1:
                return Response.ok(gson.toJson(new GetDataOut(usrList.get(0)))).build();  
                
                default:
                throw new IllegalStateException("More than one user with the"
                        + "same nickname");
            }
        }
         
        
        List<GetDataOut> getDataOutList = new ArrayList<>();
        
        // Just get all users if groupid isn't given
        if(inData.groupid == null)
        {
            for(User usr : userReg.findAll())
            {
                getDataOutList.add(new GetDataOut(usr));
            }
        }
        else
        {           
            UserGroup userGroup = uGroupReg.find(inData.groupid);
            // Respond with status 'not found' if there's no group corresponding
            // to the given groupid
            if(userGroup == null)
            {
                return Response.status(NOT_FOUND).build();
            }
            // Respond with not unauthoirzed if the requesting user isn't part
            // of the group which corresponds to the given groupid.
            // A non-member is not allowed a list of group members
            if(!user.isMemberOfGroup(userGroup))
            {
                return Response.status(UNAUTHORIZED).build();
            }
            
            for(User usr : userReg.findAll())
            {
                if(usr.isMemberOfGroup(userGroup))
                {
                    getDataOutList.add(new GetDataOut(usr));
                }
            }
        }

        // Newest post first
        sort(getDataOutList, new GDOComparator());
        
        int lSize = getDataOutList.size();        
        
        // Reduce the number of users in the list if count is given and the number
        // of users is greater than count
        if(inData.count != null && lSize > inData.count)
        {
            // Negative count is not allowed
            if(inData.count < 0)
            {
                return Response.status(BAD_REQUEST).build();
            }         

            // The first in ascending id order are retained
            getDataOutList = getDataOutList.subList(0, inData.count);

        }

        return Response.ok(gson.toJson(getDataOutList)).build();
    }
    
    private class GDOComparator implements Comparator<GetDataOut>
    {
        @Override
        public int compare(GetDataOut lGDO, GetDataOut rGDO)
        {
            return  lGDO.id.compareTo(rGDO.id);
        }
    }
    
    public static class LoginData 
    {
        public String email; 
        public String password;
    }
    
    public static class LoginDataOut
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

    public static class PutData 
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
    
    public static class RegisterData 
    {
        public String email;
        public String nick;
        public String password;
    }
    
    public static class RegisterDataOut
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
        
        // Give the user membership in the public user group
        Membership pubMembership = 
            new Membership(user, getPublicGroup(uGroupReg), 1);
        memshipReg.create(pubMembership);
        
        // Respond with status 'ok' and only the ID if the
        // nick did not already exists
        return Response.ok(gson.toJson(new RegisterDataOut(user))).build();
    }
    
    // For getting the 'Public' user group
    private static synchronized UserGroup getPublicGroup(UserGroupRegistry uGroupReg)
    {
        if(publicGroup == null)
        {
            List<UserGroup> groupsWithNamePublic = uGroupReg.findByName("Public");
            
            switch(groupsWithNamePublic.size())
            {
                case 0:
                publicGroup = new UserGroup("Public");
                uGroupReg.create(publicGroup);
                break;
                
                case 1:
                publicGroup = groupsWithNamePublic.get(0);
                break;
                
                default:
                throw new IllegalStateException("More than one user group with"
                        + "the name 'Public'");
            }
        }
        
        return publicGroup;
    }
}