package com.qreal.robots.model.auth;

import com.qreal.robots.model.diagram.Diagram;
import com.qreal.robots.model.robot.Robot;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    private String username;
    private String password;
    private boolean enabled;
    private Set<UserRole> userRole = new HashSet<>(0);
    private Set<Robot> userRobots = new HashSet<>(0);
    private Set<Diagram> userDiagrams = new HashSet<>(0);

    public User() {
    }

    public User(String username, String password, boolean enabled) {
        this.username = username;
        this.password = password;
        this.enabled = enabled;
    }

    public User(String username, String password,
                boolean enabled, Set<UserRole> userRole) {
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.userRole = userRole;
    }

    @Id
    @Column(name = "username", unique = true,
            nullable = false, length = 45)
    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Column(name = "password",
            nullable = false, length = 60)
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Column(name = "enabled", nullable = false)
    public boolean isEnabled() {
        return this.enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    public Set<UserRole> getUserRole() {
        return this.userRole;
    }

    public void setUserRole(Set<UserRole> userRole) {
        this.userRole = userRole;
    }


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    public Set<Robot> getUserRobots() {
        return this.userRobots;
    }

    public void setUserRobots(Set<Robot> userRobots) {
        this.userRobots = userRobots;
    }

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    public Set<Diagram> getUserDiagrams() {
        return this.userDiagrams;
    }

    public void setUserDiagrams(Set<Diagram> userDiagrams) {
        this.userDiagrams = userDiagrams;
    }

}