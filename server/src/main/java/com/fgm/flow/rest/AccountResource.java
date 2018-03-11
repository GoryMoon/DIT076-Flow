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
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.*;
import javax.ws.rs.core.UriInfo;
import static java.util.Collections.sort;
import java.util.Comparator;

import static java.lang.System.out;
import static java.lang.System.err;
import java.security.MessageDigest;
import javax.xml.bind.annotation.adapters.HexBinaryAdapter;
import java.nio.charset.Charset;
import java.security.NoSuchAlgorithmException;

/**
 *
 * Handles requests related to user accounts
 * 
 * @author fgm
 */
@Path("account")
public class AccountResource
{
    @EJB
    private UserRegistry userReg;
    @EJB
    private UserGroupRegistry uGroupReg;
    @EJB
    private MembershipRegistry memshipReg;
    private final Gson gson = new Gson();

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
        public String email;
        
        public GetDataOut(User user)
        {
            this.id = user.getId();
            this.nick = user.getNick();
            this.email = user.getEmail();
        }
    }
    
    // For retrieving user account data
    @POST
    @Path("get")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(GetData inData)
    {   
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
            
            switch(usrList.size())
            {
                case 0:
                return Response.status(NOT_FOUND).build();
                
                case 1:
                User usr = usrList.get(0);
                if(inData.nick != null && !usr.getNick().equals(inData.nick))
                {
                    return Response.status(NOT_FOUND).build();
                }
                return Response.ok(gson.toJson(new GetDataOut(usr))).build(); 
                
                default:
                // Respond with status 'internal server error' if there is more
                // than one user with the same email - should not be possible
                return Response.status(INTERNAL_SERVER_ERROR).build();
            }
        }
        
        // ... nick
        if(inData.nick != null)
        {
            List<User> usrList = userReg.findByNick(inData.nick);
            
            switch(usrList.size())
            {
                case 0:
                return Response.status(NOT_FOUND).build();
                
                case 1:
                return Response.ok(gson.toJson(new GetDataOut(usrList.get(0)))).build();  
                
                default:
                // Respond with status 'internal server error' if there is more
                // than one user with the same nick - should not be possible
                return Response.status(INTERNAL_SERVER_ERROR).build();
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
                if(usr.hasAnyMembershipStatus(userGroup))
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
    
    // Handles logging in
    @POST
    @Path("login")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response loginRequest(LoginData inData)
    {
        out.println(getPasswordHash(inData.password));
        
        // Check user object
        if(inData.email == null || inData.password == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        List<User> usersWithEmail = userReg.findByEmail(inData.email);
        
        // Respond with status 'internal server error' if more than one user
        // is registered with the given email - shouldn't be possible
        if(usersWithEmail.size() > 1)
        {
            return Response.status(INTERNAL_SERVER_ERROR).build();
        }
        
        // Respond with status 'unauthorized' if no user
        // is registered with the given email
        if(usersWithEmail.size() == 0)
        {
            return Response.status(UNAUTHORIZED).build();
        }
        
        
        User user = usersWithEmail.get(0);
        
        // Respond woth status 'unauthorized' if an incorrect password has
        // been supplied for the user
        if(!user.getPassword().equals(getPasswordHash(inData.password)))
        {
            return Response.status(UNAUTHORIZED).build();           
        }        
        
        // Respond with status 'ok' and the ID if login was successful
        return Response.ok(gson.toJson(new LoginDataOut(user))).build();
    }

    public static class PutData 
    {
        public Integer userid;
        public Integer id; // For further development - ie admin functionality
        public String email;
        public String nick;
        public String password;
    }
    
    public static class PutDataOut 
    {
        public Integer id;
        public String nick;
        
        public PutDataOut(User user)
        {
            this.id = user.getId();
            this.nick = user.getNick();
        }
    }
    
    // For updating user account data    
    @POST
    @Path("put")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response putRequest(PutData inData)
    {
        
        if(inData.userid == null || inData.id == null
                || (inData.email == null && inData.nick == null 
                    && inData.password == null)
        )
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        // Currently the only one allowed to change user data is the user
        // themselves - could be expanded into admin functionality
        if(!inData.userid.equals(inData.id))
        {
            return Response.status(UNAUTHORIZED).build();
        }
        
        User user = userReg.find(inData.userid);
        
        // Return status 'not found' if user does not exist
        if(user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        if(inData.email != null)
        {
            List<User> usrList = userReg.findByEmail(inData.email);
            
            switch(usrList.size())
            {
                // Update the user object with the given email if that email
                // isn't registered already
                case 0:
                user.setEmail(inData.email);
                break;
                
                // Respond with status 'conflict' if there already is a user
                // with the give email.
                case 1:
                // Allows "updating" to the same email
                if(usrList.get(0).equals(user))
                {
                    break;
                }
                return Response.status(CONFLICT).build(); 
                
                default:
                // Respond with status 'internal server error' if there is more
                // than one user with the same email - should not be possible
                return Response.status(INTERNAL_SERVER_ERROR).build();
            }   
        }
                
        if(inData.nick != null)
        {
            if(inData.nick != null)
            {
                List<User> usrList = userReg.findByNick(inData.nick);

                switch(usrList.size())
                {
                    // Update the user object with the given nick if that nick
                    // isn't registered already
                    case 0:
                    // Allows "updating" to the same nick
                    user.setNick(inData.nick);
                    break;

                    // Respond with status 'conflict' if there already is a user
                    // with the given nick. Note that 'conflict' will be given
                    // also if the user is trying to change to the nick they 
                    // already have
                    case 1:
                    if(usrList.get(0).equals(user))
                    {
                        break;
                    }
                    return Response.status(CONFLICT).build(); 

                    default:
                    // Respond with status 'internal server error' if there is more
                    // than one user with the same nick name - should not be possible
                    return Response.status(INTERNAL_SERVER_ERROR).build();
                }   
            }
        }
        
        if(inData.password != null)
        {
            user.setPassword(getPasswordHash(inData.password));
        }
        
        userReg.update(user);
        
        return Response.ok(gson.toJson(new PutDataOut(user))).build();
    }
    
    @PUT
    @Path("put")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response putRequestPUT(PutData inData)
    {
        return putRequest(inData);
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
        // Respond with status 'bad request' if email, nick or password
        // hasn't been supplied
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
  
        User user = new User(inData.email, inData.nick,
                getPasswordHash(inData.password));    
        
        userReg.create(user);
        
        // Give the user membership in the public user group
        Membership pubMembership = 
            new Membership(user, PublicGroupSingle.getInstance(uGroupReg), 1);
        memshipReg.create(pubMembership);
        
        // Respond with status 'ok' and only the ID if the
        // nick did not already exists
        return Response.ok(gson.toJson(new RegisterDataOut(user))).build();
    }
    
    // For password hashing
    private String getPasswordHash(String password)
    {
        try
        {   MessageDigest md = MessageDigest.getInstance("SHA-512");
            return (new HexBinaryAdapter()).marshal(md.digest(password.getBytes(Charset.forName("UTF-8"))));
        }
        catch(NoSuchAlgorithmException e)
        {
            err.println("Failed to create password hash");
            return password;
        }
    }
    

    /**
     * Handles the singular 'Public' group
     * 
     * @author fgm
     * 
     */
    private static class PublicGroupSingle 
    { 
        private static UserGroup publicGroup;

        // For getting the 'Public' user group
        private static synchronized UserGroup getInstance(UserGroupRegistry uGroupReg)
        {
            // Initialise publicGroup if necessary
            if(publicGroup == null)
            {
                List<UserGroup> groupsWithNamePublic = uGroupReg.findByName("Public");

                switch(groupsWithNamePublic.size())
                {
                    // Create user group 'Public' if it does not exist
                    case 0:
                    publicGroup = new UserGroup("Public");
                    uGroupReg.create(publicGroup);
                    break;

                    case 1:
                    publicGroup = groupsWithNamePublic.get(0);
                    break;
                    
                    // Throw IllegalStateException if there is more than one
                    // 'Public' user group, which shouldn't be possible
                    default:
                    throw new IllegalStateException("More than one user group with"
                            + "the name 'Public'");
                }
            }

            return publicGroup;
        }
    }
}