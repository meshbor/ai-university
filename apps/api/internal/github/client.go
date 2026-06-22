package github

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Client struct {
	Token  string
	Repo   string
	Client *http.Client
}

func NewClient(token, repo string) *Client {
	return &Client{
		Token:  token,
		Repo:   repo,
		Client: &http.Client{Timeout: 15 * time.Second},
	}
}

type Issue struct {
	Number  int    `json:"number"`
	HTMLURL string `json:"html_url"`
}

func (c *Client) CreateIssue(title, body string, labels []string) (*Issue, error) {
	payload := map[string]any{
		"title":  title,
		"body":   body,
		"labels": labels,
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("https://api.github.com/repos/%s/issues", c.Repo)
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(raw))
	if err != nil {
		return nil, err
	}
	c.setHeaders(req)

	res, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	respBody, _ := io.ReadAll(res.Body)
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("github api %d: %s", res.StatusCode, string(respBody))
	}

	var issue Issue
	if err := json.Unmarshal(respBody, &issue); err != nil {
		return nil, err
	}
	return &issue, nil
}

func (c *Client) DispatchRepository(eventType string, clientPayload map[string]any) error {
	payload := map[string]any{
		"event_type":     eventType,
		"client_payload": clientPayload,
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("https://api.github.com/repos/%s/dispatches", c.Repo)
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(raw))
	if err != nil {
		return err
	}
	c.setHeaders(req)

	res, err := c.Client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode == http.StatusNoContent || (res.StatusCode >= 200 && res.StatusCode < 300) {
		return nil
	}
	respBody, _ := io.ReadAll(res.Body)
	return fmt.Errorf("github dispatch %d: %s", res.StatusCode, string(respBody))
}

func (c *Client) CommentOnIssue(number int, body string) error {
	payload := map[string]string{"body": body}
	raw, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("https://api.github.com/repos/%s/issues/%d/comments", c.Repo, number)
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(raw))
	if err != nil {
		return err
	}
	c.setHeaders(req)

	res, err := c.Client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode >= 200 && res.StatusCode < 300 {
		return nil
	}
	respBody, _ := io.ReadAll(res.Body)
	return fmt.Errorf("github comment %d: %s", res.StatusCode, string(respBody))
}

func (c *Client) setHeaders(req *http.Request) {
	req.Header.Set("Authorization", "Bearer "+c.Token)
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")
}
